class BookingValidReserveWdayService
  def initialize(booking)
    @booking = booking
  end

  def perform
    return_result = {
      result: :success
    }

    last_reservation_by_date = Setting.last_reservation_by_date
    start_date_wday = @booking.start_date.wday

    departure_time_with_date = Time.zone.parse(@booking.departure_time)
    departure_time_in_min = (departure_time_with_date - Time.zone.now.beginning_of_day).to_i / 60

    wday_arr = %w[sunday monday tuesday wednesday thursday friday saturday]
    closed_time_in_min = last_reservation_by_date[wday_arr[start_date_wday]]
    if closed_time_in_min.present? && closed_time_in_min.to_i < departure_time_in_min
      closed_time = (Time.zone.now.beginning_of_day + closed_time_in_min.minutes).strftime("%I:%M%P")
      return_result[:result] = :booking_not_meet_reserve_wday
      return_result[:message] =
        "Departure time need to be set before #{closed_time} on #{wday_arr[start_date_wday]}"
    end
    return_result
  end
end
