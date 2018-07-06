require "rails_helper"

describe BookingValidReserveService do
  it "should meet reserve hours before 10am cut off time" do
    booking_created_at = Time.zone.parse("2016-11-15 03:00")
    puts booking_created_at.to_s
    Setting.booking_settings = {
      booking_reserve_hours: 7
    }.to_json
    booking = build(
      :booking,
      start_date: "2016-11-15".to_date
    )
    result = BookingValidReserveService.new(booking, booking_created_at).perform
    expect(result[:result]).to eq(:success)
  end

  it "shouldn't meet reserve hours before 10am cut off time" do
    booking_created_at = Time.zone.parse("2016-11-15 03:01")
    Setting.booking_settings = {
      booking_reserve_hours: 7
    }.to_json
    booking = build(
      :booking,
      start_date: "2016-11-15".to_date
    )
    result = BookingValidReserveService.new(booking, booking_created_at).perform
    expect(result[:result]).to eq(:booking_not_meet_reserve_hours)
    expect(result[:message]).to eq("Bookings need to be made 7hrs before the 10am cut off time.")
  end

  it "should allow booking that book before 2 hours after the cut off" do
    booking_created_at = Time.zone.parse("2016-11-15 12:00")
    Setting.booking_settings = {
      booking_reserve_hours: -2
    }.to_json
    booking = build(
      :booking,
      start_date: "2016-11-15".to_date
    )
    result = BookingValidReserveService.new(booking, booking_created_at).perform
    expect(result[:result]).to eq(:success)
  end

  it "shouldn't allow booking that book before 2 hours after the cut off" do
    booking_created_at = Time.zone.parse("2016-11-15 12:01")
    Setting.booking_settings = {
      booking_reserve_hours: -2
    }.to_json
    booking = build(
      :booking,
      start_date: "2016-11-15".to_date
    )
    result = BookingValidReserveService.new(booking, booking_created_at).perform
    expect(result[:result]).to eq(:booking_not_meet_reserve_hours)
    expect(result[:message]).to eq("Bookings need to be made before 12:00pm.")
  end
end
