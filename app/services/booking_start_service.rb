class BookingStartService

  def initialize(booking)
    @booking = booking
  end

  def perform
    red_flags = @booking.user.red_flag.keys.as_json
    @booking.assign_attributes({
      start_booking_at: Time.now,
      status: :in_use,
      fuel_start: @booking.boat.fuel_remain,
      red_flags: red_flags.present? ? red_flags : nil
    })
    if red_flags.present?
      OverrideStartBookingMailer.notify_email(@booking, red_flags).deliver_later
    end
    @booking.save(validate: false)
    @booking.boat.in_use!
  end
end