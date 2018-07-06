class Transaction < ApplicationRecord
  before_create :build_description

  belongs_to :booking, optional: true

  # Not every transaction linked to a charge. Ex, refund transaction
  belongs_to :charge, optional: true
  belongs_to :staff, class_name: 'User'
  belongs_to :user, optional: true

  # :created   : charge was created in system
  # :succeeded : transaction was made succesffully with Stripe
  # :pending   : transaction is pending, waiting for synced up with Stripe
  # :failed    : transaction was failed received from Stripe
  # :refunded  : charge was refunded in system
  enum status: [ :created, :succeeded, :pending, :failed, :refunded ]

  # Out/In on behalf of user
  # Out (debit) means user balance got charged
  # In (credit) means user balance got refunded
  enum in_out: [ :out, :in ]
  enum source: [ :stripe, :user_balance, :cash, :check ]

  delegate :full_name, to: :staff, prefix: true, allow_nil: true

  def member_full_name
    self.charge.present? ? self.charge.try(:user).try(:full_name) : self.user.try(:full_name)
  end

  def member_email
    self.charge.try(:user).try(:email)
  end

  ransacker :booking_id do
    Arel.sql(
        "regexp_replace(
      to_char(\"#{table_name}\".\"booking_id\", '9999999'), ' ', '', 'g')"
    )
  end

  private
  def build_description
    return if self.description.present?
    self.description = ChargeDescriptionBuilderService.new(charge).perform if charge.present?
  end

  def self.to_csv(transactions)
    attributes = %w{id created_at_utc staff_full_name member_full_name member_email description source status charge_type debit credit}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      transactions.each do |transaction|
        csv << attributes.map{ |attr| transaction.send(attr) }
      end
    end
  end

  def debit
    (in_out == 'in') ? ActionController::Base.helpers.number_to_currency(self.amount) : ''
  end

  def credit
    (in_out == 'out') ? ActionController::Base.helpers.number_to_currency(self.amount) : ''
  end

  def created_at_utc
    created_at.utc
  end

  # TODO: fix plz, this is very dirty, can be break if we change desc text
  def charge_type
    if is_tax
      return 10
    elsif description.include?('Refund for')
      return 5
    elsif description.include?('Cancellation fee')
      return 11
    end
    case charge.charge_type
      when 'booking'
        3
      when 'fuel'
        6
      when 'cleaning'
        7
      when 'damage'
        8
      when 'other'
        9
      when 'security_deposit'
        2
      when 'membership'
        1
      when 'lesson'
        4
    end
  end
end
