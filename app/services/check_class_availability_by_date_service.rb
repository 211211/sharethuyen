class CheckClassAvailabilityByDateService
  def initialize(params)
    @booking_id = params[:booking_id]
    @boat_class = params[:boat_class]
    @date = params[:date]
    @num_of_not_yard_status_boat = params[:num_of_not_yard_status_boat]
    @current_time = params[:current_time].presence || Time.zone.now
  end

  def perform
    num_of_not_yard_by_date = @boat_class.boats.ransack(
      status_eq:        Boat.statuses[:yard],
      yard_end_date_lt: @date
    ).result.count

    num_of_boats = @num_of_not_yard_status_boat + num_of_not_yard_by_date

    result = {
      availability: :no
    }
    return result if booking_too_late?(@date)

    num_booking_of_class = get_num_of_booking_by_class(@date)
    result[:num_of_bookings] = num_booking_of_class
    result[:availability] = :full_day if num_booking_of_class < num_of_boats
    return result if result[:availability] == :full_day

    # Give the last chance when this boat_class have a late booking on the date
    if Setting.second_booking_depart_from.present?
      result_check_late = check_late_booking_by_date(@date, num_booking_of_class, num_of_boats)
      result[:availability] = result_check_late[:availability]
      result[:return_before] = result_check_late[:return_before]
    end
    result
  end

  def check_late_booking_by_date(date, num_booking_of_class, num_of_boats)
    late_bookings_ransack_q = {
      start_date_eq:                          date,
      departure_time_in_sec_gteq:             Setting.second_booking_depart_from,
      status_in:                              [
        Booking.statuses[:tba],
        Booking.statuses[:confirmed],
        Booking.statuses[:in_use],
        Booking.statuses[:processing]
      ],
      g: [{
        boat_boat_class_id_eq: @boat_class.id,
        g: [{
          boat_id_present: 0,
          boat_class_id_eq: @boat_class.id
        }],
        m: "or"
      }]
    }
    late_bookings_ransack = Booking.ransack(late_bookings_ransack_q)
    late_bookings_ransack.sorts = "departure_time_in_sec asc"
    late_bookings = late_bookings_ransack.result
    enough_late_booking = (num_booking_of_class - late_bookings.count) < num_of_boats

    second_booking_time_before_hand = Setting.second_booking_time_before_hand
    second_booking_time_before_hand = 30 if second_booking_time_before_hand.blank?
    if enough_late_booking
      {
        availability:  :half_day,
        return_before: late_bookings.first.departure_time_in_sec - second_booking_time_before_hand
      }
    else
      {
        availability: :no
      }
    end
  end

  def get_num_of_booking_by_class(date)
    Booking.ransack(
      id_not_eq:                              @booking_id,
      start_date_lteq:                        date,
      end_date_gteq:                          date,
      status_in:                              [Booking.statuses[:tba],
                                               Booking.statuses[:confirmed],
                                               Booking.statuses[:in_use],
                                               Booking.statuses[:processing]],
      g: [{
        boat_boat_class_id_eq: @boat_class.id,
        g: [{
          boat_id_present: 0,
          boat_class_id_eq: @boat_class.id
        }],
        m: "or"
      }]
    ).result.count
  end

  def booking_too_late?(date)
    date == @current_time.to_date &&
      (@current_time.hour > 17 || (@current_time.hour == 17 && @current_time.min > 45))
  end
end
