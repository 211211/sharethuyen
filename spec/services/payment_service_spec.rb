require "rails_helper"

describe PaymentService do
  before(:each) do
    Setting.booking_charge_sale_tax = false
    Setting.e_commerce_charge_sale_tax = false
  end

  it "should should update correct user balance" do
    user = create(
      :user,
      balance: 50.0
    )
    booking = build(
      :booking,
      user: user
    )
    staff = create(:user)
    charge = create(
      :charge,
      amount: 20.0,
      source: :user_balance,
      booking: booking
    )
    charge_mailer_class_double = class_double("ChargeMailer").as_stubbed_const(transfer_nested_constants: true)
    charge_mailer = double("ChargeMailer")
    allow(charge_mailer).to receive(:deliver_later).and_return(true)
    allow(charge_mailer_class_double).to receive(:new_charge_email).and_return(charge_mailer)
    PaymentService.new(charge, user, staff).perform
    expect(user.balance).to eq(30)
  end
end
