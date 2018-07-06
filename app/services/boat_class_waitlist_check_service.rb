class BoatClassWaitlistCheckService
  def initialize(booking, current_time)
    @booking = booking
    @current_time = current_time
  end

  def perform
    return_result = {
      result: :success
    }

    added_waitlists = BoatClassWaitlist.ransack(
      user_id_eq: @booking.user.id,
      boat_class_id_eq: @booking.boat_class_id,
      date_in: @booking.start_date..@booking.end_date,
      reserve_until_gt: @current_time
    ).result
    return return_result if added_waitlists.count.positive?

    waitlists = BoatClassWaitlist.ransack(
      boat_class_id_eq: @booking.boat_class_id,
      date_in: @booking.start_date..@booking.end_date,
      reserve_until_gt: @current_time
    ).result
    return return_result unless waitlists.count.positive?
    return_result[:result] = :failure
    wailist = waitlists.first
    reserved_in = ((wailist.reserve_until - @current_time) / 60).to_i
    return_result[:message] = "#{wailist.boat_class.name} class on #{wailist.date} was reserved for waitlist members in next #{reserved_in} minutes"
    return_result
  end
end
