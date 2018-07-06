class BookingImageSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :name, :size, :url, :thumbnail_url, :delete_url, :delete_type, :photo_type

  def name
    object.read_attribute(:image)
  end

  def size
    object.image.size
  end

  def url
    object.image.url
  end

  def thumbnail_url
    object.image.thumb.url
  end

  def delete_url
    admin_booking_booking_image_path(object.booking, object.id)
  end

  def delete_type
    'DELETE'
  end
end
