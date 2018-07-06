class SettingAsset < ApplicationRecord
  mount_uploader :file, SettingAssetUploader
  
  validates :setting_key, presence: true
  validates :setting_key, uniqueness: true
end
