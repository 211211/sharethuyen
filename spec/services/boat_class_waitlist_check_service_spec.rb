require "rails_helper"

describe BoatClassWaitlistCheckService do
  it "should prevent other member create booking if it was reserve for waitlist member, reserve_until is active" do
    boat_class = create(:boat_class, name: "Boat Class A")
    user = create(:user)
    other = create(:user)
    current_time = Time.zone.parse("2016-06-10 00:00")
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
      user: other,
      date: Date.parse("2018-06-20"),
      reserve_until: current_time + 20.minutes
    )

    check_result = BoatClassWaitlistCheckService.new(booking, current_time).perform
    expect(check_result[:result]).to eq(:failure)
    expect(check_result[:message]).to eq("Boat Class A class on 06/20/2018 was reserved for waitlist members in next 20 minutes")
  end

  it "should not prevent other member create booking if it was reserve for waitlist member, reserve_until is outdated" do
    boat_class = create(:boat_class, name: "Boat Class A")
    user = create(:user)
    other = create(:user)
    current_time = Time.zone.parse("2016-06-10 00:00")
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
      user: other,
      date: Date.parse("2018-06-20"),
      reserve_until: current_time - 1.minutes
    )

    check_result = BoatClassWaitlistCheckService.new(booking, current_time).perform
    expect(check_result[:result]).to eq(:success)
  end

  it "should not prevent other member create booking if they're also have waitlist for that date" do
    boat_class = create(:boat_class, name: "Boat Class A")
    user = create(:user)
    current_time = Time.zone.parse("2016-06-10 00:00")
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
      date: Date.parse("2018-06-20"),
      reserve_until: current_time + 10.minutes
    )

    check_result = BoatClassWaitlistCheckService.new(booking, current_time).perform
    expect(check_result[:result]).to eq(:success)
  end
end
