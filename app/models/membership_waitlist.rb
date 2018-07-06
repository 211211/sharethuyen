class MembershipWaitlist < ApplicationRecord
  belongs_to :user
  belongs_to :charge, optional: true

  validates :user, :paid_amount, :membership_type, presence: true
  enum status: [:requested, :approved, :closed]
end
