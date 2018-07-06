class BoatClass < ApplicationRecord

  validates :name, presence: true, uniqueness: true

  has_many :boats, :inverse_of => :boat_class
  has_and_belongs_to_many :users
  has_many :boat_class_prices, dependent: :destroy
end
