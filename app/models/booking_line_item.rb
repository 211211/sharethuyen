class BookingLineItem < ApplicationRecord
  include Rails.application.routes.url_helpers
  enum value: [ :yes, :no, :n_a ]
  enum line_item_type: [ :boolean ]

  belongs_to :booking
  belongs_to :line_item,
    class_name: 'BookingChecklistLineItem',
    foreign_key: 'booking_checklist_line_item_id'

  mount_uploader :image, DefaultUploader

  def to_fileupload
    {
      files: [
        {
          name: read_attribute(:image),
          size: image.size,
          url:  image.url,
          thumbnail_url: image.thumb.url,
          delete_url: admin_booking_booking_line_item_path(booking, self.id),
          delete_type: 'DELETE'
        }
      ]
    }
  end
end
