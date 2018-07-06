require "rails_helper"

describe CheckClassAvailabilityByDateService do

  describe ".perform" do

    it "return not available if there is no boat available" do
      boat_class = create(:boat_class)
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 0
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
    end

    it "return available if there is one boat available" do
      boat_class = create(:boat_class)
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 1
      )
      result = service.perform
      expect(result[:availability]).to eq(:full_day)
    end

    it "return available if there is one boat available but booking time before 17h45" do
      boat_class = create(:boat_class)
      current_time = Time.zone.parse("2018-03-23 17:44")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 1,
        current_time:  current_time
      )
      result = service.perform
      expect(result[:availability]).to eq(:full_day)
    end

    it "return not available if there is one boat available but booking time after 17h45" do
      boat_class = create(:boat_class)
      current_time = Time.zone.parse("2018-03-23 17:46")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 1,
        current_time:  current_time
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
    end

    it "return not available if there is one boat available with status :yard" do
      boat_class = create(:boat_class)
      create(:boat, boat_class: boat_class, status: :yard)
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 0
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
    end

    it "return available if there is one boat available with status :yard end yard_end_date before today" do
      boat_class = create(:boat_class)
      create(:boat, boat_class: boat_class, status: :yard, yard_end_date: Date.new(2018, 03, 22))
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 0
      )
      result = service.perform
      expect(result[:availability]).to eq(:full_day)
    end

    it "return not available if there is one boat available with status :dock, but got assigned to a booking" do
      boat_class = create(:boat_class)
      boat = create(:boat, boat_class: boat_class, status: :dock)
      create(:booking, boat: boat, start_date: Date.new(2018, 3, 20), end_date: Date.new(2018, 3, 23))
      current_time = Time.zone.parse("2018-03-23 10:30")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 0,
        current_time:  current_time
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
    end

    it "return correct number of bookings on that in tba, confirmed, in_use, processing statues" do
      boat_class = create(:boat_class)
      boat = create(:boat, boat_class: boat_class, status: :dock)
      create(:booking, boat: boat, start_date: Date.new(2018, 3, 20), end_date: Date.new(2018, 3, 23))
      create(
        :booking,
        boat: nil,
        boat_class: boat_class,
        start_date: Date.new(2018, 3, 20),
        end_date: Date.new(2018, 3, 23),
        status: :confirmed
      )
      create(
        :booking,
        boat: nil,
        boat_class: boat_class,
        start_date: Date.new(2018, 3, 20),
        end_date: Date.new(2018, 3, 23),
        status: :in_use
      )
      current_time = Time.zone.parse("2018-03-23 10:30")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 0,
        current_time:  current_time
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
      expect(result[:num_of_bookings]).to eq(3)
    end

    #
    # The idea here is to support assign a boat of another boat class to a booking
    # 1. Booking create on Boat Class A
    # 2. User one to use boat from Boat Class B
    # 3. Boat Class A now available for booking
    #
    it "return available if the booking was assign to boat that in another boat class" do
      boat_class_a = create(:boat_class)
      create(:boat, boat_class: boat_class_a, status: :dock)
      boat_class_b = create(:boat_class)
      boat_b = create(:boat, boat_class: boat_class_b, status: :dock)
      create(
        :booking,
        boat: boat_b,
        boat_class: boat_class_a,
        start_date: Date.new(2018, 3, 23),
        end_date: Date.new(2018, 3, 25),
        departure_time: "03:00pm"
      )
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class_a,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 1
      )
      result = service.perform
      expect(result[:availability]).to eq(:full_day)
    end

    #
    # The idea here is to support assign a boat of another boat class to a booking
    # 1. Booking create on Boat Class A
    # 2. User want to use boat from Boat Class B
    # 3. One boat from Boat Class B is not available anymore
    #
    it "return not available if the boat was assign to one booking that created for another boat class" do
      boat_class_a = create(:boat_class)
      create(:boat, boat_class: boat_class_a, status: :dock)
      boat_class_b = create(:boat_class)
      boat_b = create(:boat, boat_class: boat_class_b, status: :dock)
      create(
        :booking,
        boat: boat_b,
        boat_class: boat_class_a,
        start_date: Date.new(2018, 3, 23),
        end_date: Date.new(2018, 3, 25),
        departure_time: "03:00pm"
      )
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class_b,
        date: Date.new(2018, 3, 23),
        num_of_not_yard_status_boat: 1
      )
      result = service.perform
      expect(result[:availability]).to eq(:no)
    end
  end

  describe ".check_late_booking_by_date" do
    it "return available for half day if there is a late booking on the date" do
      boat_class = create(:boat_class)
      boat = create(:boat, boat_class: boat_class, status: :dock)
      create(
        :booking,
        boat:           boat,
        start_date:     Date.new(2018, 3, 23),
        end_date:       Date.new(2018, 3, 25),
        departure_time: "03:30pm"
      )
      current_time = Time.zone.parse("2018-03-23 10:30")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date:          Date.new(2018, 3, 23),
        current_time:  current_time
      )
      result = service.send :check_late_booking_by_date, Date.new(2018, 3, 23), 1, 1
      expect(result[:availability]).to eq(:half_day)

      # return_before is 03:00pm. 30 mins before
      expect(result[:return_before]).to eq(900)
    end

    it "return no available if there is no late booking on the date" do
      boat_class = create(:boat_class)
      boat = create(:boat, boat_class: boat_class, status: :dock)
      create(
        :booking,
        boat:           boat,
        start_date:     Date.new(2018, 3, 23),
        end_date:       Date.new(2018, 3, 25),
        departure_time: "03:00pm"
      )
      current_time = Time.zone.parse("2018-03-23 10:30")
      service = CheckClassAvailabilityByDateService.new(
        boat_class: boat_class,
        date: Date.new(2018, 3, 23),
        current_time: current_time
      )
      result = service.send :check_late_booking_by_date, Date.new(2018, 3, 23), 1, 1
      expect(result[:availability]).to eq(:no)
    end
  end
end
