class BookingSerializer < ActiveModel::Serializer
  attributes  :id, :start_date, :boat_class, :boat, :booking_type, :end_date, :user_notes,
              :complete_notes, :start_booking_at, :check_in_boat_at, :departure_time,
              :status, :created_at, :no_show, :discount_notes, :discount_percent,
              :fuel_start, :fuel_end, :red_flags, :system_notes, :security_deposit, :security_deposit_amount

  has_one :user do
    object.user
  end

  has_one :boat, serializer: BoatSerializer

  has_many :transactions, serializer: TransactionSerializer
  has_many :booking_images, serializer: BookingImageSerializer
  has_many :booking_line_items, serializer: BookingLineItemSerializer
  has_many :charges, serializer: ChargeSerializer
  has_many :service_requests, serializer: ServiceRequestSerializer
  has_many :soses, serializer: SosSerializer
  has_many :booking_addons, serializer: BookingAddonSerializer

  def check_in_boat_at
    object.check_in_boat_at.to_s
  end

  def start_booking_at
    object.start_booking_at.to_s
  end

  def red_flags
    if object.red_flags.present?
      JSON.parse(object.red_flags)
    else
      []
    end
  end
end
