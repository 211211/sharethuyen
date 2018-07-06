require "rails_helper"

describe BookingAutoFeeService do
  it "should return $50 auto fee for unlimited user that cancel within 24 hours" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date: "2016-11-16".to_date,
      end_date: "2016-11-17".to_date,
      discount_percent: 0.0,
      amount_detail: amount_detail.to_json
    )
    cancellation_time = "2016-11-15 10:01".in_time_zone
    result = BookingAutoFeeService.new(booking, cancellation_time, true).perform

    expect(result[:amount]).to eq(50.0)
    expect(result[:type]).to eq(:cancelled_unlimited)
  end

  it "should return $75 auto fee for unlimited user that no show" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date: "2016-11-16".to_date,
      end_date: "2016-11-17".to_date,
      discount_percent: 0.0,
      amount_detail: amount_detail.to_json
    )
    cancellation_time = "2016-11-15 10:01".in_time_zone
    result = BookingAutoFeeService.new(booking, cancellation_time, true, true).perform

    expect(result[:amount]).to eq(75.0)
    expect(result[:type]).to eq(:no_show_unlimited)
  end

  it "should return $25 auto fee for sharepass user that no show" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date: "2016-11-16".to_date,
      end_date: "2016-11-17".to_date,
      discount_percent: 0.0,
      amount_detail: amount_detail.to_json
    )
    cancellation_time = "2016-11-15 10:01".in_time_zone
    result = BookingAutoFeeService.new(booking, cancellation_time, false, true).perform

    expect(result[:amount]).to eq(25.0)
    expect(result[:type]).to eq(:no_show)
  end
end
