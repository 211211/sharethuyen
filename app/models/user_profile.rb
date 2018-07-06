class UserProfile < ApplicationRecord
  belongs_to :user

  mount_uploader :wa_state_marine_photo, WaStateMarinePhotoUploader
  mount_uploader :driver_license_photo, DriverLicensePhotoUploader
end
