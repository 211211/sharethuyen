class BookingNumOfBoatBlockedService
  def initialize(booking)
    @booking = booking
  end

  def perform
    num_of_boat_blocked = 0
    block_out_rules = Setting.block_out_rules
    start_date = @booking.start_date
    end_date = @booking.end_date
    return num_of_boat_blocked if block_out_rules.blank?
    block_out_rules = JSON.parse(block_out_rules)
    return num_of_boat_blocked if block_out_rules.count <= 0
    block_out_rules.each do |rule|
      if rule['kind'] == 'boat'
        boat_id = rule['boat_id'].to_i
        boat = Boat.find_by(id: boat_id)
        next if boat.blank?
        if boat.boat_class_id == @booking.boat_class_id
          dates = rule['dates']
          dates.each do |block_date_str|
            block_date = Date.parse(block_date_str)
            if start_date <= block_date && end_date >= block_date
              num_of_boat_blocked += 1
            end
          end
        end
      end
    end
    num_of_boat_blocked
  end
end
