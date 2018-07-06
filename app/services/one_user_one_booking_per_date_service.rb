class OneUserOneBookingPerDateService
  def initialize(booking)
    @booking = booking
  end

  def perform
    return_result = {
      result: :success
    }

    start_date = @booking.start_date
    end_date = @booking.end_date
    ransack_booking_q = {
      g: [{
        id_not_eq: @booking.id,
        g: [{
          start_date_or_end_date_in: start_date..end_date,
          g: [{
            start_date_lt: start_date,
            end_date_gt: end_date
          }],
          m: "or"
        }]
      }],
      user_id_eq: @booking.user_id,
      status_in: [
        Booking.statuses[:tba],
        Booking.statuses[:confirmed],
        Booking.statuses[:in_use]
      ]
    }
    bookings = Booking.ransack(ransack_booking_q).result
    if bookings.count.positive?
      return_result[:result] = :booking_already_exist
      return_result[:message] = error_msg
    end
    return_result
  end

  private

  def error_msg
    "Sorry you already have a booking for this day."
  end
end
