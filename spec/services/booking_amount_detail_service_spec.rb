require "rails_helper"

describe BookingAmountDetailService do
  it "should return correct booking's worth amount detail" do
    GetPriceService.any_instance.stub(perform: 10.0)
    booking = build(
      :booking,
      start_date: "2017-01-01".to_date,
      end_date: "2017-01-02".to_date,
      user: create(:user),
      boat_class: create(:boat_class)
    )
    result = BookingAmountDetailService.new(booking, false).perform
    expect(result).to eq(
      amount: 20.0,
      amount_detail: {
        "01/01/2017": 10.0,
        "01/02/2017": 10.0
      }.to_json
    )
  end

  it "should return correct booking's amount to be charged for new booking" do
    GetPriceService.any_instance.stub(perform: 10.0)
    booking = build(
      :booking,
      start_date: "2017-01-01".to_date,
      end_date: "2017-01-02".to_date,
      user: create(:user),
      boat_class: create(:boat_class)
    )
    result = BookingAmountDetailService.new(booking).perform
    expect(result).to eq(
      amount: 20.0,
      amount_detail: {
        "01/01/2017": 10.0,
        "01/02/2017": 10.0
      }.to_json
    )
  end

  it "shouldnot count the amount in common the past" do
    GetPriceService.any_instance.stub(perform: 10.0)
    booking = create(
      :booking,
      start_date: "2017-01-01".to_date,
      end_date: "2017-01-02".to_date,
      user: create(:user),
      boat_class: create(:boat_class)
    )
    booking.end_date = "2017-01-05".to_date
    result = BookingAmountDetailService.new(booking).perform
    expect(result).to eq(
      amount: 30.0,
      amount_detail: {
        "01/03/2017": 10.0,
        "01/04/2017": 10.0,
        "01/05/2017": 10.0
      }.to_json
    )
  end

  it "should exclude the amount in the past" do
    GetPriceService.any_instance.stub(perform: 10.0)
    booking = create(
      :booking,
      start_date: "2017-01-01".to_date,
      end_date: "2017-01-02".to_date,
      user: create(:user),
      boat_class: create(:boat_class)
    )
    booking.start_date = "2017-01-05".to_date
    booking.end_date = "2017-01-05".to_date
    result = BookingAmountDetailService.new(booking).perform
    expect(result).to eq(
      amount: 10.0,
      amount_detail: {
        "01/05/2017": 10.0
      }.to_json
    )
  end
end
