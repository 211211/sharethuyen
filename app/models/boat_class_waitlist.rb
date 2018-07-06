class BoatClassWaitlist < ApplicationRecord
  belongs_to :user
  belongs_to :boat_class
end
