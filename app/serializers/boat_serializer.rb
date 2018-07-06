class BoatSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :year, :length, :engine,
    :engine_hours, :seating, :bathroom, :capacity,
    :identifier, :fuel_consumption, :cruising_speed, :us_coast_guard_capacity,
    :status, :boat_class_id, :yard_end_date, :created_at, :status_humanized,
    :fuel_meter_enabled, :fuel_rate_of_burn, :fuel_remain, :fuel_meter, :statuses,
             :booking_checklist_category_ids, :latitude, :longitude, :location_updated_at

  has_one :primary_image do
    primary_image = object.boat_images.detect(&:is_primary)
    if primary_image.present?
      primary_image.image_url.thumb.url
    else
      '/imgs/app/no-image-available.jpg'
    end
  end

  has_many :boat_images
  has_many :boat_amenities

  def status_humanized
    object.status.humanize
  end

  def statuses
    Boat::statuses.map do |k,v|
    {
      key: k,
      name: k.capitalize
    }
    end
  end

  def booking_checklist_category_ids
    object.booking_checklist_category_ids
  end
end
