class BoatsAssignedBetweenByClassService
  def initialize(class_id, start_date, end_date)
    @class_id = class_id
    @start_date = start_date
    @end_date = end_date
  end

  def perform
    boats_assigned =
      Boat
      .joins(:bookings)
      .where("boats.boat_class_id = ?
              AND (
                    (bookings.start_date BETWEEN ? AND ? OR bookings.end_date BETWEEN ? AND ?)
                    OR (bookings.start_date <= ? AND bookings.end_date >= ?)
              )", @class_id, @start_date, @end_date, @start_date, @end_date, @start_date, @end_date)
      .where(bookings: {status: [Booking.statuses[:confirmed], Booking.statuses[:in_use]]})
      .not_in_yard
      .not_in_use.distinct

    second_booking_depart_from = Setting.second_booking_depart_from
    return boats_assigned if second_booking_depart_from.blank?

    boats_assigned_late_on_end_date =
      Boat
      .joins(:bookings)
      .where("boats.boat_class_id = ?", @class_id)
      .where("bookings.start_date = ?", @end_date)
      .where("bookings.departure_time_in_sec >= ?", second_booking_depart_from)
      .where(bookings: {status: [Booking.statuses[:confirmed], Booking.statuses[:in_use]]})
      .not_in_yard
      .not_in_use.distinct.to_a

    boats_assigned_exclude_late_start =
      Boat
      .joins(:bookings)
      .where("boats.boat_class_id = ?
              AND (
                    (bookings.start_date BETWEEN ? AND ? OR bookings.end_date BETWEEN ? AND ?)
                    OR (bookings.start_date <= ? AND bookings.end_date >= ?)
              )", @class_id, @start_date, @end_date, @start_date, @end_date, @start_date, @end_date)
      .where.not("bookings.start_date = ?", @end_date)
      .where(bookings: {status: [Booking.statuses[:confirmed], Booking.statuses[:in_use]]})
      .not_in_yard
      .not_in_use.distinct

    # We might want to utilize those boats that was book late in the date, but need to make sure
    # in wasn't assigned in other bookings in that duration
    result = boats_assigned.to_a.reject do |boat|
      boats_assigned_late_on_end_date.include?(boat) && !boats_assigned_exclude_late_start.include?(boat)
    end
    result
  end
end
