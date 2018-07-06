=begin
block_out_rules = [  
  {  
    "kind":"all",
    "dates":[  
      "2018-05-04"
    ],
    "notes":"This is note for alll"
  },
  {  
    "kind":"boat",
    "dates":[  
      "2018-06-16"
    ],
    "boat_id":"25"
  },
  {  
    "kind":"boat_class",
    "dates":[  
      "2018-08-02",
      "2018-08-03"
    ],
    "boat_class_id":"1"
  }
]
=end
class BoatCalendarBlockOutService
  def initialize(boat, start_date, end_date)
    @boat = boat
    @start_date = start_date
    @end_date = end_date
  end

  def perform
    block_out_rules = Setting.block_out_rules
    return [] if block_out_rules.blank?
    block_out_events = []
    block_out_rules = JSON.parse(block_out_rules, object_class: OpenStruct)
    block_out_rules.each do |rule|
      if rule.kind.to_sym == :all
        block_out_events += events_from_dates(rule.dates, "All Blocked", rule)
      end
      if rule.kind.to_sym == :boat_class && @boat.boat_class_id == rule.boat_class_id.to_i
        block_out_events += events_from_dates(rule.dates, "Class Blocked", rule)
      end
      if rule.kind.to_sym == :boat && @boat.id == rule.boat_id.to_i
        block_out_events += events_from_dates(rule.dates, "Boat Blocked", rule)
      end
    end
    block_out_events
  end

  private

  def events_from_dates(dates, title, rule)
    if rule.notes.present?
      title = "[#{title}] - #{rule[:notes]}" 
    end
    events = []
    dates.each do |date_str|
      date = Date.parse(date_str)
      if @start_date <= date && date <= @end_date
        events << {
          start_date: date,
          end_date: date,
          title: title,
          event_type: :block_out
        }
      end
    end
    events
  end
end
