class BoatClassPrice < ApplicationRecord
  enum price_type: [:base, :peak, :happy_hour, :weekend, :holiday]
  enum membership_type: [:daily, :mid_week, :full, :unlimited, :shared]

  belongs_to :boat_class
end
