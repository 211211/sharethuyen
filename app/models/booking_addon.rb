class BookingAddon < ApplicationRecord
  enum status: [ :unpaid, :paid, :cancelled ]
  belongs_to :addon
  belongs_to :booking
  belongs_to :charge, optional: true

  def amount
    self[:quantity].to_f * self[:price]
  end
end
