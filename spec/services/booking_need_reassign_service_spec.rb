require "rails_helper"

describe BookingNeedReassignService do

  describe ".peform" do
    it "return empty booking need re-assign boat" do
      boat = create(:boat)
      create(:booking,
        status: :confirmed,
        end_date: Date.parse("2018-06-27"),
        boat: boat
      )
      bookings = BookingNeedReassignService.new(Date.parse("2018-06-26")).perform
      expect(bookings.size).to eq(0)
    end

    it "return 1 booking need re-assign boat" do
      boat = create(:boat,
        status: :yard
      )
      create(:booking,
        status: :confirmed,
        end_date: Date.parse("2018-06-27"),
        boat: boat
      )
      bookings = BookingNeedReassignService.new(Date.parse("2018-06-26")).perform
      expect(bookings.size).to eq(1)
    end

    it "shouldnot count booking in the past" do
      boat = create(:boat,
        status: :yard
      )
      create(:booking,
        status: :confirmed,
        end_date: Date.parse("2018-06-25"),
        boat: boat
      )
      bookings = BookingNeedReassignService.new(Date.parse("2018-06-26")).perform
      expect(bookings.size).to eq(0)
    end

    it "should count yard_end_date in the future" do
      boat = create(:boat,
        status: :yard,
        yard_end_date: Date.parse("2018-06-26")
      )
      create(:booking,
        status: :confirmed,
        end_date: Date.parse("2018-06-26"),
        boat: boat
      )
      bookings = BookingNeedReassignService.new(Date.parse("2018-06-26")).perform
      expect(bookings.size).to eq(1)
    end

    it "shouldnot count yard_end_date in the past" do
      boat = create(:boat,
        status: :yard,
        yard_end_date: Date.parse("2018-06-25")
      )
      create(:booking,
        status: :confirmed,
        end_date: Date.parse("2018-06-26"),
        boat: boat
      )
      bookings = BookingNeedReassignService.new(Date.parse("2018-06-26")).perform
      expect(bookings.size).to eq(0)
    end
  end
end
