class BookingImage < ApplicationRecord
  include Rails.application.routes.url_helpers

  belongs_to :booking

  enum photo_type: [ :before, :after ]
  mount_uploader :image, DefaultUploader

  validates :image, presence: true

  def to_fileupload
    {
      files: [
        {
          id:   read_attribute(:id),
          name: read_attribute(:image),
          size: image.size,
          url:  image.url,
          thumbnail_url: image.thumb.url,
          delete_url: admin_booking_booking_image_path(booking, id),
          delete_type: 'DELETE'
        }
      ]
    }
  end
end
