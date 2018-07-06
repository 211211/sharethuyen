class BookingValidReserveService
  def initialize(booking, booking_created_at)
    @booking = booking
    @booking_created_at = booking_created_at
  end

  def perform
    return_result = {
      result: :success
    }

    booking_settings = Setting.booking_settings
    
    # Do not check valid reserve if admin haven't configure
    return return_result unless booking_settings.present?

    booking_settings = JSON.parse(booking_settings).to_h
    booking_reserve_hours = booking_settings['booking_reserve_hours'].to_i
    booking_start_date = @booking.start_date
    # 0 used as a flag to turn off reserve hour rule
    if booking_reserve_hours != 0
      if booking_reserve_hours > 0
        booking_time_before = (booking_start_date.in_time_zone + 10.hours).ago(booking_reserve_hours * 60 * 60)
        if booking_time_before < @booking_created_at
          return_result[:result] = :booking_not_meet_reserve_hours
          return_result[:message] = "Bookings need to be made #{booking_reserve_hours}hrs before the 10am cut off time."
        end
      else
        booking_time_before = booking_start_date.in_time_zone + 10.hours - (booking_reserve_hours * 60 * 60)
        if booking_time_before < @booking_created_at
          return_result[:result] = :booking_not_meet_reserve_hours
          return_result[:message] = "Bookings need to be made before #{booking_time_before.strftime("%I:%M%P")}."
        end
      end
    end

    booking_rules = booking_settings['booking_rules']
    if booking_rules.present? && booking_rules.count > 0
      booking_rules.each { |booking_rule|
        start_date = Date.parse(booking_rule['start_date'])
        end_date = Date.parse(booking_rule['end_date'])
        deadline_date = Date.parse(booking_rule['deadline_date'])
        if start_date < booking_start_date && booking_start_date < end_date && deadline_date.in_time_zone < @booking_created_at

          return_result[:result] = :booking_rules
          return_result[:message] = "If you wish to book for this date please reserve before #{deadline_date.to_s}"
          break
        end
      }
    end
    return_result
  end
end