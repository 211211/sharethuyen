class BookingNeedReassignService
  def initialize(current_date)
    @current_date = current_date
  end

  def perform
    Booking.ransack(
      status_eq: Booking.statuses[:confirmed],
      boat_status_eq: Boat.statuses[:yard],
      end_date_gteq: @current_date,
      g: [{
        boat_yard_end_date_present: 0,
        boat_yard_end_date_gteq: @current_date,
        m: "or"
      }]
    ).result
  end
end
