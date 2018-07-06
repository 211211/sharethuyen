class BoatAmenitySerializer < ActiveModel::Serializer
  attributes :id, :name, :thumb_url, :image_url, :created_at

  def image_url
    object.icon.url
  end

  def thumb_url
    object.icon.thumb.url
  end

  def created_at
    object.created_at.to_s
  end
end
