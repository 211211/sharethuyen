class BoatAmenity < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :icon, presence: true
  has_and_belongs_to_many :boats

  mount_uploader :icon, BoatAmenityUploader
end
