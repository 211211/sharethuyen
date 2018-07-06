require 'rails_helper'

describe BookingValidService do

  it 'should return :booking_out_of_season' do

    Setting.season_start_date = '2017-02-01'
    Setting.season_end_date = '2017-04-01'
    user = User.new({
      confirmed_at: Time.new
    })

    booking = Booking.new({
      start_date: "2017-01-01".to_date,
      end_date: "2017-01-02".to_date,
      user: user
    })
    result = BookingValidService.new(booking).perform

    expect(result[:result]).to eq(:booking_out_of_season)
  end
end
