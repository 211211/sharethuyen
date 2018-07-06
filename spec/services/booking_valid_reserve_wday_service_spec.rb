require 'rails_helper'

describe BookingValidReserveWdayService do

  it 'should return :booking_not_meet_reserve_wday' do

    Setting.last_reservation_by_date = {
      # 900 mins from 0h is 03:00pm
      "wednesday" => 899
    }

    booking = Booking.new({
      start_date: "2018-04-04".to_date,
      end_date: "2018-04-07".to_date,
      departure_time: "03:00pm"
    })
    result = BookingValidReserveWdayService.new(booking).perform

    expect(result[:result]).to eq(:booking_not_meet_reserve_wday)
    expect(result[:message]).to eq("Departure time need to be set before 02:59pm on wednesday")
  end

  it 'should return :success' do

    Setting.last_reservation_by_date = {
      # 900 mins from 0h is 03:00pm
      "wednesday" => 900
    }

    booking = Booking.new({
      start_date: "2018-04-04".to_date,
      end_date: "2018-04-07".to_date,
      departure_time: "03:00pm"
    })
    result = BookingValidReserveWdayService.new(booking).perform

    expect(result[:result]).to eq(:success)
  end
end
