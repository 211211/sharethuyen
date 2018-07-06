require "rails_helper"

describe GetBoatClassPricesInDaysService do

  it "return 0 prices data for 2 boat_class not endorsed" do
    GetPriceService.any_instance.stub(perform: 10.0)
    CheckClassAvailabilityByDateService.any_instance.stub(perform: { availability: :full_day})
    create(:boat_class)
    create(:boat_class)
    user = create(:user)
    service = GetBoatClassPricesInDaysService.new(
      user_id: user.id,
      start_date: "2018-01-01".to_date,
      end_date: "2018-01-05".to_date
    )
    result = service.perform
    expect(result.count).to eq(0)
  end

  it "return 2 prices data for 2 boat_class" do
    GetPriceService.any_instance.stub(perform: 10.0)
    CheckClassAvailabilityByDateService.any_instance.stub(perform: { availability: :full_day})
    class_1 = create(:boat_class)
    class_2 = create(:boat_class)
    user = create(:user, boat_class_ids: [class_1.id, class_2.id])
    service = GetBoatClassPricesInDaysService.new(
      user_id: user.id,
      start_date: "2018-01-01".to_date,
      end_date: "2018-01-05".to_date
    )
    result = service.perform
    expect(result.count).to eq(2)
  end

  it "return 1 prices data for 1 boat_class for :half_day availability" do
    GetPriceService.any_instance.stub(perform: 10.0)
    CheckClassAvailabilityByDateService.any_instance.stub(perform: { availability: :half_day})
    class_1 = create(:boat_class)
    user = create(:user, boat_class_ids: [class_1.id])
    service = GetBoatClassPricesInDaysService.new(
      user_id: user.id,
      start_date: "2018-01-01".to_date,
      end_date: "2018-01-01".to_date
    )
    result = service.perform
    expect(result.count).to eq(1)
    expect(result[0][:prices]["2018-01-01"][:availability]).to eq(:half_day)
    expect(result[0][:prices]["2018-01-01"][:price]).to eq(10.0)
  end

  it "return 0 prices data for 1 boat_class for multiple dates for :half_day availability" do
    GetPriceService.any_instance.stub(perform: 10.0)
    CheckClassAvailabilityByDateService.any_instance.stub(perform: { availability: :half_day})
    class_1 = create(:boat_class)
    user = create(:user, boat_class_ids: [class_1.id])
    service = GetBoatClassPricesInDaysService.new(
      user_id: user.id,
      start_date: "2018-01-01".to_date,
      end_date: "2018-01-02".to_date
    )
    result = service.perform
    expect(result.count).to eq(0)
  end
end
