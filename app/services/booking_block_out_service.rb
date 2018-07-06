class BookingBlockOutService
  def initialize(booking)
    @booking = booking
  end

  def perform
    return_result = {
      result: :success
    }

    block_out_rules = Setting.block_out_rules

    # Do not check block_out_rules if admin haven't configure block_out_rules
    return return_result unless block_out_rules.present?

    block_out_rules = JSON.parse(block_out_rules)
    start_date = @booking.start_date
    end_date = @booking.end_date
    return return_result if block_out_rules.count <= 0
    block_out_rules.each do |rule|
      if need_check_rule?(rule['kind'], rule['boat_class_id'], @booking)
        dates = rule['dates']
        dates.each do |block_date_str|
          block_date = Date.parse(block_date_str)
          if start_date <= block_date && end_date >= block_date
            return_result[:result] = :booking_was_blocked
            break
          end
        end
      end
    end
    return return_result
  end

  def need_check_rule?(kind, boat_class_id, booking)
    kind == 'all' || (kind == 'boat_class' && boat_class_id.to_i == booking.boat_class_id)
  end
end