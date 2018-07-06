require "rails_helper"

describe OneUserOneBookingPerDateService do
  it "should return :success if there no booking" do
    new_booking = build(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed
    )
    service_result = OneUserOneBookingPerDateService.new(new_booking).perform

    expect(service_result[:result]).to eq(:success)
  end

  it "should return :success if there no booking overlap in the past" do
    create(
      :booking,
      start_date: "2018-05-09".to_date,
      end_date: "2018-05-09".to_date,
      status: :confirmed
    )
    new_booking = build(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed
    )
    service_result = OneUserOneBookingPerDateService.new(new_booking).perform

    expect(service_result[:result]).to eq(:success)
  end

  it "should return :success if there no booking belongs to another user" do
    user_1 = create(:user)
    user_2 = create(:user)
    create(
      :booking,
      start_date: "2018-05-09".to_date,
      end_date: "2018-05-09".to_date,
      status: :confirmed,
      user: user_1
    )
    new_booking = build(
      :booking,
      start_date: "2018-05-09".to_date,
      end_date: "2018-05-09".to_date,
      status: :confirmed,
      user: user_2
    )
    service_result = OneUserOneBookingPerDateService.new(new_booking).perform

    expect(service_result[:result]).to eq(:success)
  end

  it "should return :booking_already_exist if there is exist booking" do
    user = create(:user)
    create(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed,
      user: user
    )
    new_booking = build(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :tba,
      user: user
    )
    service_result = OneUserOneBookingPerDateService.new(new_booking).perform

    expect(service_result[:result]).to eq(:booking_already_exist)
    expect(service_result[:message]).to eq("Sorry you already have a booking for this day.")
  end

  it "should return :success if there is an update on persisted booking" do
    user = create(:user)
    edit_booking = create(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed,
      user: user
    )
    edit_booking.start_date = "2018-05-09".to_date
    edit_booking.end_date = "2018-05-12".to_date
    service_result = OneUserOneBookingPerDateService.new(edit_booking).perform

    expect(service_result[:result]).to eq(:success)
  end

  it "should return :booking_already_exist if there is an update on persisted booking, and new dates conflicted with other booking" do
    user = create(:user)
    create(
      :booking,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed,
      user: user
    )
    edit_booking = create(
      :booking,
      start_date: "2018-05-13".to_date,
      end_date: "2018-05-14".to_date,
      status: :tba,
      user: user
    )
    edit_booking.start_date = "2018-05-11".to_date
    edit_booking.end_date = "2018-05-11".to_date
    service_result = OneUserOneBookingPerDateService.new(edit_booking).perform

    expect(service_result[:result]).to eq(:booking_already_exist)
    expect(service_result[:message]).to eq("Sorry you already have a booking for this day.")
  end
end
