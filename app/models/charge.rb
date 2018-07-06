class Charge < ApplicationRecord
  include RailsSettings::Extend

  before_create :apply_sale_tax_if_needed
  after_commit :store_fuel_price_if_needed, on: [:create]
  after_commit :set_current_membership_charge, on: [:create, :destroy], if: :membership?
  after_commit :on_charge_status_changed, if: proc { previous_changes.has_key?('status') }

  validates :amount, presence: true
  validates :discount_percent, inclusion: { in: 0..100 }

  # A charge can belonged to booking or user
  belongs_to :booking, optional: true
  belongs_to :user, optional: true

  # Staff who created charge
  belongs_to :staff, class_name: 'User', optional: true

  has_one :ref_charge, class_name: 'Charge', foreign_key: 'ref_charge_id'
  has_one :boat_fuel_log, dependent: :nullify
  has_one :membership_waitlist, dependent: :nullify

  has_many :transactions
  has_many :booking_addons, dependent: :destroy

  # :created   : charge was created in system
  # :succeeded : charge was send to Stripe and receive succeeded
  # :pending   : charge was send to Stripe and receive pending code
  # :failed    : charge was send to Stripe and receive failed code
  # :refunded  : charge was refunded in system
  enum status: [ :created, :succeeded, :pending, :failed, :refunded ]

  enum source: [ :stripe, :user_balance, :cash, :check ]
  enum charge_type: [ :booking, :fuel, :cleaning, :damage, :other, :security_deposit, :membership, :lesson, :auto_fee,
                      :e_commerce, :booking_security_deposit ]
  enum auto_fee_type: [ :no_show_unlimited, :no_show, :cancelled_unlimited ]

  def main_transaction
    self.transactions.find_by(is_tax: false)
  end

  # this is the amount that need to charge
  # TODO: Need change to charge_amount, that make more sense. This amount calculated from discount, tax, deduct.
  # Num of references: 47
  def amount_after_tax
    if waitlist_deduct_amount.present?
      amount_after_discounted + amount_of_tax - waitlist_deduct_amount
    else
      amount_after_discounted + amount_of_tax
    end
  end

  def amount_of_tax
    amount_after_discounted * sale_tax_percent / 100
  end

  def amount_after_discounted
    amount - amount_of_discount
  end

  def amount_of_discount
    amount * discount_percent.to_f / 100
  end

  def charge_type_humanized
    self.charge_type.humanize.capitalize
  end

  def description
    ChargeDescriptionBuilderService.new(self).perform
  end

  def pay_now(user, staff)
    pay_result = {
      key: :success,
      message: "Charge #{self.id} - #{self.charge_type_humanized} has been collected successfully"
    }

    apply_sale_tax_if_needed

    if self.stripe?
      pay_result = pay_now_using_stripe(staff)
    elsif self.cash?
      pay_result = pay_now_using_cash(staff)
    elsif self.check?
      pay_result = pay_now_using_check(staff)
    else
      if self.amount_after_tax.round(2) <= user.balance.round(2)
        new_balance = user.balance.round(2) - self.amount_after_tax.round(2)
        self.assign_attributes({
                                   :status => :succeeded,
                                   :staff => staff
                               })
        if self.save!(validate: false)
          user.update_attribute(:balance, new_balance)

          # Create transactions
          TransactionService.create_transactions_from_charge(self, staff, new_balance)
          ChargeMailer.new_charge_email(self).deliver_later
        end

      else
        raise "Can not collect charge #{self.id} - #{self.charge_type_humanized} due to not enough User Balance"
      end
    end
    if pay_result[:key] == :success
      if self.security_deposit?
        BookingRedFlagResolveService.new(user, :security_deposit).perform
      end
      if self.e_commerce?
        BookingAddon.where(booking_id: self.booking_id, charge_id: self.id).update_all(status: :paid)
      end
    end

    pay_result
  end

  def pay_now_using_stripe(staff)
    user = self.get_charge_user

    pay_result = {
      key: :success,
      message: "Charge #{self.id} - #{self.charge_type_humanized} has been collected successfully"
    }

    stripe_charge = StripeService.create_charge(user.stripe_customer_id,
      self.stripe_source_id, self.amount_after_tax)

    self.assign_attributes({
                               :status => stripe_charge.status,
                               :stripe_charge_id => stripe_charge.id,
                               :staff => staff
                           })

    if self.save!(validate: false)
      # Create transactions
      TransactionService.create_transactions_from_charge(self, staff, user.balance, nil, stripe_charge.source.last4)
      ChargeMailer.new_charge_email(self).deliver_later
      UpdateStripeDescriptionJob.set(wait: 2.seconds).perform_later(stripe_charge.id, self.id)
    end

    pay_result
  end

  def pay_now_using_cash(staff)
    pay_result = {
      key: :success,
      message: "Charge #{self.id} - #{self.charge_type_humanized} has been collected successfully"
    }
    user = self.get_charge_user
    self.assign_attributes({
                               :status => :succeeded,
                               :staff => staff
                           })
    if self.save!(validate: false)
      # Create transactions
      TransactionService.create_transactions_from_charge(self, staff, user.balance)
      ChargeMailer.new_charge_email(self).deliver_later
    end
    pay_result
  end

  def pay_now_using_check(staff)
    pay_result = {
        key: :success,
        message: "Charge #{self.id} - #{self.charge_type_humanized} has been collected successfully"
    }
    user = self.get_charge_user
    self.assign_attributes({
                               :status => :succeeded,
                               :staff => staff
                           })
    if self.save!(validate: false)
      # Create transactions
      TransactionService.create_transactions_from_charge(self, staff, user.balance)
      ChargeMailer.new_charge_email(self).deliver_later
    end
    pay_result
  end

  def set_default_source(user_id)
    default_source = Charge.get_default_stripe_source(user_id)
    if default_source.present?
      self.stripe_source_id = default_source
      self.source = :stripe
    else
      self.source = :user_balance
    end
  end

  def get_charge_user
    if self.user.present?
      self.user
    else
      self.booking.user
    end
  end

  def update_payment_method(payment_method_params)
    update_result = {
      key: :success
    }
    source = payment_method_params[:source]

    # Check if should merge ref charge
    if self.user_balance? && source != 'user_balance' and self.ref_charge_id
      ref_charge = Charge.find self.ref_charge_id
      if ref_charge.present?
        ref_change_amount = ref_charge.amount
        if ref_charge.destroy
          self.update_attributes(amount: self.amount + ref_change_amount, ref_charge_id: nil)
          update_result[:type] = :remove_ref_charge
        else
          update_result[:key] = :fail
          update_result[:message] = "Cannot destroy charge: #{ref_charge.errors.full_messages}"
        end
      end
    end

    # Check if user_balance is not enough -> break charge
    if source == 'user_balance'
      charge_user = self.get_charge_user
      if charge_user.balance < self.amount_after_tax
        new_charge = self.dup
        new_charge.ref_charge = self
        new_charge.set_default_source(charge_user.id)

        user_balance_charge_amount = 100 * charge_user.balance / (100 + sale_tax_percent.to_f)
        new_charge.amount = self.amount - user_balance_charge_amount

        if new_charge.save
          self.update_attribute(:amount, user_balance_charge_amount)
          update_result[:type] = :created_new_charge
        else
          update_result[:key] = :fail
          update_result[:message] = 'Cannot create charge: #{new_charge.errors.full_messages}'
        end
      end
    end

    if update_result[:key] == :success
      self.assign_attributes({
        :stripe_source_id => payment_method_params[:stripe_source_id],
        :source => payment_method_params[:source]
      })
      self.save(validate: false)
    end
    update_result
  end

  def able_to_change?
    self.created? || self.failed?
  end

  def self.get_default_stripe_source(user_id)
    user = User.find user_id
    if user.stripe_customer_id.present?
      StripeService.get_default_source user.stripe_customer_id
    end
  end

  def self.create_security_deposit_charge(user)
    if user.group.present?
      amount = Setting.security_deposit_group_user
    elsif user.is_mid_week?
      amount = Setting.security_deposit_mid_week_user
    elsif user.is_unlimited?
      amount = Setting.security_deposit_unlimited_user
    elsif user.is_daily?
      amount = Setting.security_deposit_daily_user
    else
      amount = Setting.security_deposit_single_user
    end

    security_charge = Charge.new({
      amount: amount,
      user: user,
      charge_type: :security_deposit
    })

    security_charge.set_default_source(user.id)
    security_charge
  end

  def self.create_membership_charge(user)
    if user.group.present?
      amount = Setting.membership_group_user
    elsif user.is_mid_week?
      amount = Setting.membership_mid_week_user
    elsif user.is_unlimited?
      amount = Setting.membership_unlimited_user
    elsif user.is_daily?
      amount = Setting.membership_daily_user
    else
      amount = Setting.membership_single_user
    end

    membership_charge = Charge.new({
      amount: amount,
      user: user,
      charge_type: :membership
    })

    membership_charge.set_default_source(user.id)
    membership_charge
  end

  def self.create_lesson_charge!(amount, source, user, lesson, date, discount_percent)
    amount = amount.round(2)
    description = "Lesson '#{lesson.name}' on '#{date}' charge"
    sale_tax_percent = Setting.lesson_charge_sale_tax ? Setting.sale_tax_percent.to_f : 0
    amount_after_discount = amount - (amount * discount_percent.to_i / 100)
    amount_after_tax = amount_after_discount + (amount_after_discount * sale_tax_percent / 100)

    if source == 'cash' || source == 'check'
      charge = Charge.new(user: user, charge_type: :lesson, source: source, amount: amount, status: :succeeded, discount_percent: discount_percent)
      if charge.save!
        # Create transactions
        TransactionService.create_transactions_from_charge(charge, user, user.balance, description)

        ChargeMailer.new_charge_email(charge).deliver_later
      end
    elsif source == 'user_balance'
      if amount_after_tax.round(2) > user.balance || user.balance <= 0
        raise Exception.new("User balance doesn't enough to make payment")
      end
      charge = Charge.new(user: user, charge_type: :lesson, source: :user_balance, amount: amount, status: :succeeded, discount_percent: discount_percent)
      if charge.save!
        new_balance = user.balance - amount_after_tax.round(2)
        user.update_attribute(:balance, new_balance)
        TransactionService.create_transactions_from_charge(charge, user, new_balance, description)
        ChargeMailer.new_charge_email(charge).deliver_later
      end
    else # Stripe
      charge = Charge.new(user: user, charge_type: :lesson, source: :stripe, amount: amount,
                         stripe_source_id: source, discount_percent: discount_percent)

      stripe_charge = StripeService.create_charge(user.stripe_customer_id,
                                                  source, amount_after_tax)

      charge.status = stripe_charge.status
      if charge.save!
        TransactionService.create_transactions_from_charge(charge, user, user.balance, description, stripe_charge.source.last4)
        ChargeMailer.new_charge_email(charge).deliver_later

        UpdateStripeDescriptionJob.set(wait: 2.seconds).perform_later(stripe_charge.id, charge.id)
      end
    end
  end

  def apply_sale_tax_if_needed
    if (charge_type == 'booking' && Setting.booking_charge_sale_tax) ||
        (charge_type == 'fuel' && Setting.fuel_charge_sale_tax) ||
        (charge_type == 'cleaning' && Setting.cleaning_charge_sale_tax) ||
        (charge_type == 'damage' && Setting.damage_charge_sale_tax) ||
        (charge_type == 'other' && Setting.other_charge_sale_tax) ||
        (charge_type == 'security_deposit' && Setting.security_deposit_charge_sale_tax) ||
        (charge_type == 'membership' && Setting.membership_charge_sale_tax) ||
        (charge_type == 'lesson' && Setting.lesson_charge_sale_tax) ||
        (charge_type == 'auto_fee' && Setting.auto_fee_charge_sale_tax) ||
        (charge_type == 'e_commerce' && Setting.e_commerce_charge_sale_tax)
      self.sale_tax_percent = Setting.sale_tax_percent
    end
  end

  private

  def store_fuel_price_if_needed
    if charge_type == 'fuel'
      gallon_price = Setting.gallon_price
      self.settings.gallon_price = gallon_price
    end
  end

  def set_current_membership_charge
    return if !membership? || user.membership_charges.blank?

    user.membership_charges.update_all(is_current: false)
    user.membership_charges.first.update_column(:is_current, true)
  end

  def on_charge_status_changed
    self.update_column(:paid_on, Time.now) if self.succeeded?

    if self.succeeded? and self.membership?
      UpdateMembershipStatusService.new(self.user, self).perform
    end
  end
end
