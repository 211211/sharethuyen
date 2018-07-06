class BookingLineItemSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :booking_id, :line_item_id, :line_item_type, :value, :value_string,
    :url, :thumbnail_url, :name, :delete_url, :delete_type

  def url
    object.image.url
  end

  def thumbnail_url
    object.image.thumb.url
  end

  def line_item_id
    if object.line_item.present?
      object.line_item.id
    end
  end

  def name
    object.read_attribute(:image)
  end

  def size
    object.image.size
  end

  def delete_url
    admin_booking_booking_line_item_path(object.booking, object.id)
  end

  def delete_type
    'DELETE'
  end
end
