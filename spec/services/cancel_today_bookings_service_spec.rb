require "rails_helper"

describe CancelTodayBookingsService do
  it "should cancel 2 bookings, donot cancel admin_use booking" do
    create(
      :booking,
      start_date: "2018-05-10".to_date,
      status: :confirmed
    )
    create(
      :booking,
      start_date: "2018-05-15".to_date,
      status: :in_use
    )
    create(
      :booking,
      start_date: "2018-05-15".to_date,
      status: :tba
    )
    create(
      :booking,
      start_date: "2018-05-15".to_date,
      status: :tba,
      booking_type: :admin_use
    )
    current_date = "2018-05-30".to_date

    BookingAutoFeeChargeService.any_instance.stub(perform: nil)
    CancelTodayBookingsService.new(current_date).perform

    expect(Booking.cancelled.count).to eq(2)
    expect(Booking.where(no_show: true).count).to eq(2)
    expect(Booking.tba.count).to eq(1)
    expect(Booking.confirmed.count).to eq(0)
  end
end
