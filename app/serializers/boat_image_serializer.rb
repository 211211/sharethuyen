class BoatImageSerializer < ActiveModel::Serializer
  attributes :id, :image_url, :is_primary, :boat_id

  def image_url
    object.image_url.url
  end
end
