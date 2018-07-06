require "rails_helper"

describe BoatNeedAttentionService do

  describe ".boat_need_attention_on_booking" do

    it "return boat with need_attention status and booking linked with it" do
      boat = create(:boat, status: :need_attention)
      boat_dock = create(:boat, status: :dock)
      booking = create(:booking, boat: boat)
      create(:booking, boat: boat_dock)
      boats = BoatNeedAttentionService.new(Date.parse("2018-06-26")).send :boat_need_attention_on_booking
      expect(boats.size).to eq(1)
      expect(boats[0][:attention_type]).to eq(:booking)
      expect(boats[0][:id]).to eq(boat.id)
      expect(boats[0][:booking_id]).to eq(booking.id)
    end
  end

  describe ".boat_need_attention_return_from_yard" do

    it "return boat with that return from yard on tomorrow" do
      boat = create(:boat,
        status: :yard,
        yard_end_date: Date.parse("2018-06-27")
      )
      create(:boat,
        status: :yard,
        yard_end_date: Date.parse("2018-06-28")
      )
      boats = BoatNeedAttentionService.new(Date.parse("2018-06-26")).send :boat_need_attention_return_from_yard
      expect(boats.size).to eq(1)
      expect(boats[0][:id]).to eq(boat.id)
      expect(boats[0][:yard_end_date]).to eq("2018-06-27")
    end
  end
end
