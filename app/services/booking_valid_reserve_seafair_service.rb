class BookingValidReserveSeafairService
  def initialize(booking)
    @booking = booking
  end

  def perform
    return_result = {
      result: :success
    }

    booking_settings = Setting.booking_settings

    # Do not check seafair if admin haven't configure seafair
    return return_result if booking_settings.blank?

    booking_settings = JSON.parse(booking_settings).to_h

    seafair_dates = booking_settings['seafair_dates']
    return return_result if seafair_dates.blank?
    return return_result if seafair_dates['start_date'].blank?
    return return_result if seafair_dates['end_date'].blank?

    seafair_start_date = Date.parse(seafair_dates['start_date'])
    seafair_end_date = Date.parse(seafair_dates['end_date'])

    booking_start_date = @booking.start_date
    booking_end_date = @booking.end_date

    if (booking_start_date >= seafair_start_date && booking_end_date <= seafair_end_date) ||
      (booking_start_date <= seafair_end_date && booking_end_date >= seafair_end_date)

      # Booking is created during seafair season
      max_start_date = [booking_start_date, seafair_start_date].max
      min_end_date = [booking_end_date, seafair_end_date].min
      if min_end_date - max_start_date > 0
        return_result[:result] = :seafair_one_day_only
      else
        num_of_booking_q = {
          user_id_eq: @booking.user.id,
          start_date_or_end_date_in: seafair_start_date..seafair_end_date
        }
        num_of_booking_q[:id_not_eq] = @booking.id if @booking.id.present?
        num_of_booking = Booking.not_cancelled.ransack(num_of_booking_q).result.count
        if num_of_booking.positive?
          return_result[:result] = :seafair_one_booking_only
        end
      end
    end
    return_result
  end
end