class BookingAfterSaveService
  def initialize(booking, booking_new_record)
    @booking = booking
    @booking_new_record = booking_new_record
  end

  def perform
    RemindBookingService.new(@booking).perform
    BoatClassWaitlist.ransack(
      boat_class_id_eq: @booking.boat_class_id,
      user_id_eq: @booking.user_id,
      date_in: @booking.start_date..@booking.end_date
    ).result.destroy_all
    if @booking_new_record
      BookingMailer.confirmation_email(@booking).deliver_later
    end
  end
end
