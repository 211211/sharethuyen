require "rails_helper"

describe BoatsAssignedBetweenByClassService do
  it "should return 2 boats assigned on overlap booking's dates" do
    boat_class = create(:boat_class)
    boat_class_2 = create(:boat_class)
    boat_1 = create(
      :boat,
      boat_class: boat_class
    )
    boat_2 = create(
      :boat,
      boat_class: boat_class
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-11".to_date,
      status: :confirmed,
      boat: boat_1
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-15".to_date,
      end_date: "2018-05-16".to_date,
      status: :in_use,
      boat: boat_2
    )
    create(
      :booking,
      boat_class: boat_class_2,
      start_date: "2018-05-12".to_date,
      end_date: "2018-05-13".to_date
    )
    result = BoatsAssignedBetweenByClassService.new(boat_class.id, "2018-05-11".to_date, "2018-05-15".to_date).perform

    expect(result.count).to eq(2)
  end

  it "should return 1 boat assigned on old booking that cover both start_date and end_date of new booking" do
    boat_class = create(:boat_class)
    boat = create(
      :boat,
      boat_class: boat_class
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-10".to_date,
      end_date: "2018-05-20".to_date,
      status: :confirmed,
      boat: boat
    )
    result = BoatsAssignedBetweenByClassService.new(boat_class.id, "2018-05-11".to_date, "2018-05-15".to_date).perform

    expect(result.count).to eq(1)
    expect(result[0].id).to eq(boat.id)
  end

  it "should return 1 boats assigned, 1 boat is avaible due to late assign on start_date" do
    Setting.second_booking_depart_from = 930
    boat_class = create(:boat_class)
    boat = create(
      :boat,
      boat_class: boat_class
    )
    boat_2 = create(
      :boat,
      boat_class: boat_class
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-15".to_date,
      end_date: "2018-05-20".to_date,
      status: :confirmed,
      boat: boat,
      departure_time_in_sec: 930
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-12".to_date,
      end_date: "2018-05-15".to_date,
      status: :confirmed,
      boat: boat_2
    )
    result = BoatsAssignedBetweenByClassService.new(boat_class.id, "2018-05-14".to_date, "2018-05-15".to_date).perform
    expect(result.count).to eq(1)
  end

  it "should return 2 boats assigned, 1 boat is not avaible due to doesn't meet second_booking_depart_from setting" do
    Setting.second_booking_depart_from = 930
    boat_class = create(:boat_class)
    boat = create(
      :boat,
      boat_class: boat_class
    )
    boat_2 = create(
      :boat,
      boat_class: boat_class
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-15".to_date,
      end_date: "2018-05-20".to_date,
      status: :confirmed,
      boat: boat,
      departure_time_in_sec: 929
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-12".to_date,
      end_date: "2018-05-15".to_date,
      status: :confirmed,
      boat: boat_2
    )
    result = BoatsAssignedBetweenByClassService.new(boat_class.id, "2018-05-14".to_date, "2018-05-15".to_date).perform
    expect(result.count).to eq(2)
  end

  it "should return 2 boats assigned, 1 boat is late booking but have another booking in the new booking duration" do
    Setting.second_booking_depart_from = 930
    boat_class = create(:boat_class)
    boat = create(
      :boat,
      boat_class: boat_class
    )
    boat_2 = create(
      :boat,
      boat_class: boat_class
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-15".to_date,
      end_date: "2018-05-20".to_date,
      status: :confirmed,
      boat: boat,
      departure_time_in_sec: 930
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-12".to_date,
      end_date: "2018-05-15".to_date,
      status: :confirmed,
      boat: boat_2
    )
    create(
      :booking,
      boat_class: boat_class,
      start_date: "2018-05-14".to_date,
      end_date: "2018-05-14".to_date,
      status: :confirmed,
      boat: boat
    )
    result = BoatsAssignedBetweenByClassService.new(boat_class.id, "2018-05-14".to_date, "2018-05-15".to_date).perform
    expect(result.count).to eq(2)
  end
end
