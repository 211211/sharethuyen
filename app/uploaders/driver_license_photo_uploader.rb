class DriverLicensePhotoUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  storage :aws

  def store_dir
    "user_profiles/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  process resize_to_fit: [800, 800]

  version :thumb do
    process resize_to_fill: [500,500]
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
