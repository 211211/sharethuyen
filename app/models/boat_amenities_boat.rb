class BoatAmenitiesBoat < ApplicationRecord

  belongs_to :boat
  belongs_to :boat_amenity

  validates_presence_of :boat
  validates_presence_of :boat_amenity

  accepts_nested_attributes_for :boat

end
