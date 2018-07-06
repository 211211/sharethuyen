class UserProfileSerializer < ActiveModel::Serializer
  attributes :id,
        :wa_state_marine_field,
        :driver_license_field,
        :wa_state_marine_photo_url,
        :wa_state_marine_photo_thumb_url,
        :driver_license_photo_url,
        :driver_license_photo_thumb_url

  def wa_state_marine_photo_url
    object.wa_state_marine_photo.url
  end

  def wa_state_marine_photo_thumb_url
    object.wa_state_marine_photo.thumb.url
  end

  def driver_license_photo_url
    object.driver_license_photo.url
  end

  def driver_license_photo_thumb_url
    object.driver_license_photo.thumb.url
  end
end
