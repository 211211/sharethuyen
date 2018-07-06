class Boat < ApplicationRecord
  scope :not_in_yard, -> { where.not(status: Boat.statuses[:yard]) }
  scope :not_in_use, -> { where.not(status: Boat.statuses[:in_use]) }
  scope :assigned_boats_between, -> (start_date, end_date) {
    joins(:bookings)
        .where('boats.boat_class_id IS NOT NULL
                            AND (
                                  (bookings.start_date BETWEEN ? AND ? OR bookings.end_date BETWEEN ? AND ?)
                                  OR (bookings.start_date <= ? AND bookings.end_date >= ?)
                                  OR (bookings.start_date >= ? AND bookings.end_date <= ?)
                            )',
               start_date, end_date, start_date, end_date, start_date, end_date, start_date, end_date)
        .where({bookings: {status: [Booking.statuses[:confirmed], Booking.statuses[:in_use]]}})
        .not_in_yard
        .not_in_use.uniq
  }

  STATUS_ORDERS = [0, 1, 4, 3, 2]

  scope :order_by_status, -> {
    order_by = ['case']
    STATUS_ORDERS.each_with_index do |role, index|
      order_by << "WHEN status=#{role} THEN #{index}"
    end
    order_by << 'end'
    order(order_by.join(' '))
  }

  has_many :boat_amenities_boats, :inverse_of => :boat, :autosave => true
  has_many :boat_amenities, through: :boat_amenities_boats
  has_many :boat_images, :inverse_of => :boat
  has_and_belongs_to_many :booking_checklist_categories
  accepts_nested_attributes_for :boat_amenities_boats
  has_many :bookings
  has_many :boat_fuel_logs, dependent: :destroy
  has_many :boat_yard_logs, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :fuel_remain, :inclusion => { :in => 0..16 }

  belongs_to :boat_class
  accepts_nested_attributes_for :boat_images, allow_destroy: true

  enum status: [ :dock, :in_use, :yard, :need_attention, :processing ]

  # Hold primary_image_id submited for a boat
  attr_accessor :primary_image_id

  def primary_image(version = nil)
    primary_image = self.boat_images.find_by(is_primary: true)
    if primary_image.blank?
      "/imgs/app/" + [version, "no-image-available.jpg"].compact.join('_')
    elsif version.present?
      primary_image.image_url.send(version).url
    else
      primary_image.image_url.url
    end
  end

  self.per_page = 10

  def boat_in_yard?(date)
    (self.yard? && (self.yard_end_date.blank? || self.yard_end_date > date))
  end
end
