class BookingService

  def self.on_weekend_holiday?(start_date, end_date)
    on_weekend = false

    holiday_arr = JSON.parse(Setting.holidays)
    holidays = holiday_arr.map { |holiday|
      Date.parse(holiday["date"])
    }
    start_date.upto(end_date).each { |date|
      if date.saturday? || date.sunday? || holidays.include?(date)
        on_weekend = true
      end
    }
    on_weekend
  end

  def self.count_weekend_holiday(start_date, end_date)
    count = 0
    holiday_arr = JSON.parse(Setting.holidays)
    holidays = holiday_arr.map { |holiday|
      Date.parse(holiday["date"])
    }
    start_date.upto(end_date).each { |date|
      if date.saturday? || date.sunday? || holidays.include?(date)
        count += 1
      end
    }
    count
  end

  def self.max_weekend_holiday_for_group(shared_group)
    num_of_paid_member = shared_group.paid_members
    max_day = 0
    if num_of_paid_member < 2
      max_day = 0
    elsif num_of_paid_member == 2
      max_day = 2
    else
      max_day = 3
    end
  end

  def self.update_line_items(line_items)
    need_attention = false
    line_items.each { |booking_line_item|
      if booking_line_item[:line_item_type] == :boolean.to_s
        line_item = BookingLineItem.where({
          booking_id: booking_line_item[:booking_id],
          booking_checklist_line_item_id: booking_line_item[:booking_checklist_line_item_id]
        })[0]
        if line_item.present?
          line_item.value = booking_line_item[:value]
        else
          line_item = BookingLineItem.new(booking_line_item)
        end
        line_item.save
        if line_item.no?
          need_attention = true
        end
      else
        line_item = BookingLineItem.where({
          booking_id: booking_line_item[:booking_id],
          line_item_type: booking_line_item[:line_item_type].to_sym
        })[0]
        if line_item.present?
          line_item.value_string = booking_line_item[:value_string]
        else
          line_item = BookingLineItem.new(booking_line_item)
        end
        line_item.save
      end
    }
    need_attention
  end

  def self.weekend_bookings_of_user(user)
    if user.group.present?
      weekend_bookings = user.group.active_weekend_bookings
    else
      weekend_bookings = user.active_weekend_bookings
    end

    weekend_bookings_count = weekend_bookings.inject(0) do |sum, booking|
      sum + BookingService.count_weekend_holiday(booking.start_date, booking.end_date)
    end
    return weekend_bookings, weekend_bookings_count
  end
end
