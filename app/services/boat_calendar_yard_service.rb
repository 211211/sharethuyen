class BoatCalendarYardService
  def initialize(boat, start_date, end_date)
    @boat = boat
    @start_date = start_date
    @end_date = end_date
  end

  def perform
    where_query = {
      boat_id_eq: @boat.id,
      g: [{
        start_date_or_end_date_in: @start_date..@end_date,
        g: [{
          start_date_lt: @start_date,
          end_date_gt: @end_date
        }],
        end_date_present: 0,
        m: "or"
      }]
    }
    yard_log_ransack = BoatYardLog.ransack(where_query)
    yard_log_ransack.sorts = "start_date asc"
    yard_events = []
    yard_log_ransack.result.each do |log|
      yard_events << {
        start_date: log.start_date,
        end_date: log.end_date,
        event_type: :yard
      }
    end
    yard_events
  end
end
