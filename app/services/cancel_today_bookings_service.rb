class CancelTodayBookingsService
  def initialize(current_date)
    @current_date = current_date
  end

  def perform
    admin_users = User.with_role :admin
    staff = admin_users.first

    need_to_cancel_bookings = Booking.ransack(
      status_in: [Booking.statuses[:tba], Booking.statuses[:confirmed]],
      start_date_lteq: @current_date,
      booking_type_not_in: [Booking.booking_types[:admin_use], Booking.booking_types[:lesson_use]]
    ).result

    need_to_cancel_bookings.each do |booking|
      BookingAutoFeeChargeService.new(booking, staff, nil, true).perform
      booking.update_attributes(
        status: :cancelled,
        no_show: true
      )
    end
  end
end
