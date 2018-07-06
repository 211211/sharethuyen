require "rails_helper"

describe ChargeMailer, :type => :mailer do
  describe "new_charge_email" do

    boat_class = BoatClass.new({
      name: 'Boat Class A'
    })
    user = User.new({
      email: 'admin@example.com',
      password: '123456',
      first_name: 'Su',
      last_name: 'Tran'
    })
    booking = Booking.new({
      start_date: Date.new(2016, 11, 18),
      end_date: Date.new(2016, 11, 22),
      boat_class: boat_class,
      user: user
    })
    charge = Charge.new({
      amount: 30.22,
      charge_type: :booking
    })
    booking.charges << charge

    let(:mail) { ChargeMailer.new_charge_email charge }

    it "renders the headers" do
      expect(mail.subject).to eq("New Charge Notification")
      expect(mail.to).to eq(["admin@example.com"])
    end
  end
end
