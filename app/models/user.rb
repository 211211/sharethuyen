class User < ApplicationRecord
  acts_as_token_authenticatable
  attr_accessor :invited_email

  scope :can_add_to_group, -> { includes(:membership_charges, :roles)
                                    .where(charges: {charge_type: Charge.charge_types[:membership]})
                                    .where.not(charges: { status: Charge.statuses[:succeeded]})
                                    .with_any_role(:user_single, :mid_week, :unlimited)
  }

  validates :first_name, presence: true
  validates :last_name, presence: true

  mount_uploader :profile_picture, ProfilePictureUploader

  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  enum membership_status: [:unpaid, :paid, :expired]

  validates_confirmation_of :password

  has_one :current_membership_charge, -> { where(charge_type: :membership, is_current: true) }, class_name: 'Charge'
  has_one :current_membership_waitlist, -> { order id: :desc }, class_name: 'MembershipWaitlist'
  has_one :security_deposit_charge, -> { where charge_type: :security_deposit }, class_name: 'Charge'
  has_one :user_profile, dependent: :destroy
  has_many :billing_addresses, :inverse_of => :user, dependent: :destroy
  has_many :bookings
  has_many :charges
  has_many :transactions, dependent: :destroy
  has_many :membership_waitlists, dependent: :destroy
  has_many :membership_charges, -> { where(charge_type: :membership).order('id desc') }, class_name: 'Charge'

  has_and_belongs_to_many :boat_classes


  accepts_nested_attributes_for :billing_addresses, allow_destroy: true
  accepts_nested_attributes_for :user_profile

  belongs_to :group, optional: true

  def full_name
    "#{first_name} #{last_name}"
  end

  ransacker :full_name do |parent|
    Arel::Nodes::InfixOperation.new('||',
                                    Arel::Nodes::InfixOperation.new('||',
                                                                    parent.table[:first_name], Arel::Nodes.build_quoted(' ')
                                    ),
                                    parent.table[:last_name]
    )
  end

  def active_bookings(update_booking_id = nil)
    self.bookings.select { |booking|
      (booking.id != update_booking_id) && (booking.tba? || booking.confirmed?)
    }
  end

  def active_weekend_bookings
    self.bookings.select { |booking|
      (booking.tba? || booking.confirmed?) && booking.is_on_weekend
    }
  end

  def create_user(send_welcome_email = true)
    result = {
      status: :success
    }

    self.build_user_profile if self.user_profile.blank?

    # Don't join group if the invited email doesn't on pending invitations of group anymore
    if self.group.present? && self.invited_email.present? && !self.group.invitations_include?(self.invited_email)
      self.group_id = nil
    end

    # Assign default boat classes
    self.boat_class_ids = Setting.paid_boat_classes

    if self.save
      default_user_type = GetDefaultUserTypeService.new.perform
      self.add_role(default_user_type) if self.roles.blank?
      UserMailer.welcome(self.id).deliver_later if send_welcome_email
      SubscribeUserToMailingListJob.perform_later(self.id)

      # Remove invited_email
      if self.group.present?
        self.group.remove_pending_invitation(self.invited_email)
      end

      security_charge = Charge.create_security_deposit_charge(self)

      #TODO: Not have time to handle transaction, assume this will be saved successfully!
      unless security_charge.save
        result = {
          status: :fail,
          message: 'Cannot create security deposit charge'
        }
      end

      membership_charge = Charge.create_membership_charge(self)

      #TODO: Not have time to handle transaction, assume this will be saved successfully!
      unless membership_charge.save
        result = {
          status: :fail,
          message: 'Cannot create membership charge'
        }
      end
    else
      result = {
        status: :fail
      }
    end
    result
  end

  def red_flag
    red_flag_result = {}
    if !has_security_deposit? && membership_type != 'daily'
      red_flag_result[:need_security_deposit] = true
    end
    if self.user_profile.blank? ||
        self.user_profile.wa_state_marine_photo.blank?

      red_flag_result[:need_wa_state_marine_photo] = true
    end
    if self.user_profile.blank? ||
        self.user_profile.driver_license_photo.blank?

      red_flag_result[:need_driver_license_photo] = true
    end
    if self.has_blank_in_required_field?
      red_flag_result[:need_field_required] = true
    end
    red_flag_result
  end

  def has_blank_in_required_field?
    has_blank_in_required_field_result = false
    endorsement_check_list = JSON.parse(Setting.endorsement_check_list)
    user_endorsement = self.endorsement.present? ? JSON.parse(self.endorsement) : {}
    endorsement_check_list.each { |endorsement_check_item|
      if endorsement_check_item['required']
        field_name = endorsement_check_item['name']
        field_name_with_bracket = endorsement_check_item['name'] + '[]'

        if user_endorsement[field_name].blank? && user_endorsement[field_name_with_bracket].blank?

          has_blank_in_required_field_result = true
          break
        end
      end
    }
    has_blank_in_required_field_result
  end

  def has_security_deposit?
    self.security_deposit_charge.present? && self.security_deposit_charge.succeeded?
  end

  def clear_membership_info
    if self.has_role? :mid_week
      self.remove_role :mid_week
    end
    if self.has_role? :user_single
      self.remove_role :user_single
    end
    if self.has_role? :unlimited
      self.remove_role :unlimited
    end
    if self.has_role? :daily
      self.remove_role :daily
    end
    if self.group.present?
      user_group = self.group
      self.update_column(:group_id, nil)

      if user_group.users.blank?
        user_group.destroy
      end
    end
  end

  def update_membership(membership, is_change_by_admin = false)
    update_membership_result = {
      key: :success
    }
    membership = membership.to_sym
    membership_charge = self.current_membership_charge
    security_deposit_charge = self.security_deposit_charge
    if membership_charge.able_to_change? && security_deposit_charge.able_to_change? || is_change_by_admin
      self.clear_membership_info

      case membership
        when :daily
          self.add_role :daily

          membership_charge.update_attribute(:amount, Setting.membership_daily_user.to_f) if membership_charge.able_to_change?
          security_deposit_charge.update_attribute(:amount, Setting.security_deposit_daily_user.to_f) if security_deposit_charge.able_to_change?
        when :full
          self.add_role :user_single

          membership_charge.update_attribute(:amount, Setting.membership_single_user.to_f) if membership_charge.able_to_change?
          security_deposit_charge.update_attribute(:amount, Setting.security_deposit_single_user.to_f) if security_deposit_charge.able_to_change?
        when :mid_week
          self.add_role :mid_week

          membership_charge.update_attribute(:amount, Setting.membership_mid_week_user.to_f) if membership_charge.able_to_change?
          security_deposit_charge.update_attribute(:amount, Setting.security_deposit_mid_week_user.to_f) if security_deposit_charge.able_to_change?
        when :unlimited
          self.add_role :unlimited

          membership_charge.update_attribute(:amount, Setting.membership_unlimited_user.to_f) if membership_charge.able_to_change?
          security_deposit_charge.update_attribute(:amount, Setting.security_deposit_unlimited_user.to_f) if security_deposit_charge.able_to_change?
        when :shared
          Group.create!({
                            name: 'group-' + Time.now.to_i.to_s,
                            membership_type: :shared,
                            users: [self]
                        })

          membership_charge.update_attribute(:amount, Setting.membership_group_user.to_f) if membership_charge.able_to_change?
          security_deposit_charge.update_attribute(:amount, Setting.security_deposit_group_user.to_f) if security_deposit_charge.able_to_change?
      end
    else
      update_membership_result[:key] = :fail
      update_membership_result[:message] = 'Cannot update membership'
    end
    update_membership_result
  end

  def get_main_role
    if self.is_admin?
      :admin
    elsif self.is_dock?
      :dock
    elsif self.group&.shared?
      :shared_group
    elsif self.is_user_single?
      :full
    elsif self.is_mid_week?
      :mid_week
    elsif self.is_unlimited?
      :unlimited
    elsif self.is_daily?
      :daily
    end
  end

  def security_deposit_status
    self.security_deposit_charge.present? ? self.security_deposit_charge.status : ''
  end

  def membership_type
    if self.group.present? && self.group.membership_type.present?
      self.group.membership_type.to_s
    elsif self.has_cached_role?(:admin)
      'admin'
    elsif self.has_cached_role?(:dock)
      'dock admin'
    elsif self.has_cached_role?(:user_single)
      'full'
    elsif self.has_cached_role?(:mid_week)
      'mid_week'
    elsif self.has_cached_role?(:unlimited)
      'unlimited'
    elsif self.has_cached_role?(:daily)
      'daily'
    else
      ''
    end
  end

  def group_name
    if self.group.present?
      self.group.name
    else
      ''
    end
  end

  def season
    (current_membership_charge.present? && current_membership_charge.succeeded?) ? current_membership_charge.season : 0
  end

  def is_paid_membership_charges
    membership_status == "paid"
  end

  def is_added_payment_method
    stripe_customer_id.present?
  end

  def has_at_least_one_chargeable_payment
    return false if stripe_customer_id.blank?

    sources = StripeService.get_card(stripe_customer_id)[:sources]

    return false if sources.blank?

    sources.any? { |source| source.object == 'bank_account' ? (source.status == 'verified') : true }
  end

  def is_not_able_to_remove_payment_method
    self.bookings.any? { |booking| booking.tba? || booking.confirmed? || booking.in_use? || booking.checked_in? || booking.processing? }
  end

  def return_deposit(staff, method = 1) # 1: ACH, 2: CASH, 3: CHECK, 4: CARD
    return true unless self.security_deposit_charge.succeeded?

    deposit_charge = self.security_deposit_charge

    begin
      ActiveRecord::Base.transaction do
        TransactionService.create_deposit_return_transaction(deposit_charge, staff, method)
        deposit_charge.update_columns(
            status: Charge.statuses[:created],
            requested_return: false
        )
      end
    rescue ActiveRecord::Rollback
      return false
    end

    true
  end

  def is_in_tier_1?
    return false if membership_valid_until.blank?

    current_date = Time.zone.now.to_date
    tier_1_start_day = membership_valid_until - Setting.tier_1_before_day.to_i.days

    current_date >= tier_1_start_day && current_date < membership_valid_until
  end

  def is_in_tier_2?
    return false if membership_valid_until.blank? || !expired?

    current_date = Time.zone.now.to_date
    tier_2_end_day = membership_valid_until + Setting.tier_2_after_day.to_i.days

    current_date >= membership_valid_until && current_date < tier_2_end_day
  end

  def self.to_csv
    attributes = %w{id email full_name membership_type group_name membership_status security_deposit_status created_at}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      User.includes(:security_deposit_charge, :roles, :group).find_each do |user|
        csv << attributes.map{ |attr| user.send(attr) }
      end
    end
  end

  # protected
  def confirmation_required?
    # Bypass confirmation on login, registration due to require on booking
    false
  end
end
