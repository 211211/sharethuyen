class BoatBookingCalendarService
  def initialize(start_date, end_date, boat_class_id = nil, timeline_view)
    @start_date = start_date
    @end_date = end_date
    @boat_class_id = boat_class_id
    @timeline_view = timeline_view
  end

  def perform
    boats = []
    if @boat_class_id.nil?
      boats = Boat.all.includes(:boat_class)
    else
      boats = Boat.includes(:boat_class).where(boat_class_id: @boat_class_id)
    end

    boat_calendars = []
    boats.each do |boat|
      boat_calendar = {
        id: boat.id,
        title: boat.name,
        event_color: boat.boat_class.present? ? boat.boat_class.color_hex : "black",
        events: []
      }
      where_query = {
        boat_id_eq: boat.id,
        start_date_or_end_date_in: @start_date..@end_date
      }
      booking_ransack = Booking.not_cancelled.ransack(where_query)
      booking_ransack.sorts = "departure_time desc"
      booking_ransack.result.each do |booking|
        boat_calendar[:events] << {
          booking_id: booking.id,
          boat_id: boat.id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          departure_time: booking.get_departure_time,
          order: booking.get_departure_time,
          departure_time_s: booking.departure_time,
          user_surname: booking.user.last_name,
          status: booking.status.humanize.upcase,
          booking_type: booking.booking_type
        }
      end
      boat_calendar[:events] +=
        BoatCalendarYardService.new(boat, @start_date, @end_date).perform +
        BoatCalendarBlockOutService.new(boat, @start_date, @end_date).perform

      # Order by start_date. In order to get first event of the boat to deal with ordering
      boat_calendar[:events].sort_by! { |e| e[:start_date] }

      first_event = boat_calendar[:events].first
      if first_event.present? && first_event[:order].blank?
        # No :order information, mean this event is :block_out or :yard
        # If the first event include start_date, it has higher priority to others
        first_event[:order] = first_event[:start_date] <= @start_date ? 4.months.after : 3.months.after
      end
      boat_calendars << boat_calendar
    end

    # Sort by boat have booking and by departure_time
    boat_calendars.sort_by! do |boat|
      # min_departure_time set to 2.months.after for boat that have no event data
      # basically, the order is based on thing happen on first date of the calendar view
      # 1. Boat that have bookings ordered by departure_time
      # 2. Boat that have no booking, no yard, no blocked
      # 3. Boat that yard, or blocked not on first date
      # 4. Boat that in yard or blocked on first date
      min_departure_time = 2.months.after
      boat.fetch(:events, []).fetch(0, {}).fetch(:order, min_departure_time)
    end

    boat_calendars
  end
end
