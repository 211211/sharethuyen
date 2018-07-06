class BoatImage < ApplicationRecord
  mount_uploader :image_url, BoatImageUploader

  belongs_to :boat
  accepts_nested_attributes_for :boat
end
