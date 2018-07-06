class Addon < ApplicationRecord
  validates :name, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :quantity, numericality: { greater_than_or_equal_to: 0 }
  enum price_strategy: [:per_booking, :per_date]

  attr_accessor :remaining
end
