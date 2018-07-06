require "rails_helper"

describe BookingAfterSaveService do
  it "should destroy waitlist when create booking" do
    boat_class = create(:boat_class)
    user = create(:user)
    booking = build(
      :booking,
      boat_class: boat_class,
      user: user,
      start_date: Date.parse("2018-06-20"),
      end_date: Date.parse("2018-06-23")
    )
    create(
      :boat_class_waitlist,
      boat_class: boat_class,
      user: user,
      date: Date.parse("2018-06-15")
    )
    create(
      :boat_class_waitlist,
      boat_class: boat_class,
      user: user,
      date: Date.parse("2018-06-20")
    )

    BookingAfterSaveService.new(booking, false).perform
    waitlists = BoatClassWaitlist.all
    expect(waitlists.count).to eq(1)
    expect(waitlists[0].date).to eq(Date.parse("2018-06-15"))
  end
end
