require "rails_helper"

describe ChargeDescriptionBuilderService do
  it "should build correct booking extras charge description" do
    charge = build(
      :charge,
      charge_type: :e_commerce,
      booking_addons: [
        create(
          :booking_addon,
          addon: create(:addon, name: "Ski hire"),
          quantity: 2
        )
      ]
    )
    desc = ChargeDescriptionBuilderService.new(charge).perform
    expect(desc).to eq("Booking extras charge for 2 x Ski hire")
  end

  it "should build correct booking extras charge description for 2 addons" do
    charge = build(
      :charge,
      charge_type: :e_commerce,
      booking_addons: [
        create(
          :booking_addon,
          addon: create(:addon, name: "Ski hire"),
          quantity: 2
        ),
        create(
          :booking_addon,
          addon: create(:addon, name: "Life saver"),
          quantity: 1
        ),
        create(
          :booking_addon,
          addon: create(:addon, name: "Free item"),
          quantity: 1,
          price: 0
        ),
        create(
          :booking_addon,
          addon: create(:addon, name: "Free item 2"),
          quantity: 1,
          price: nil
        )
      ]
    )
    desc = ChargeDescriptionBuilderService.new(charge).perform
    expect(desc).to eq("Booking extras charge for 2 x Ski hire, 1 x Life saver")
  end

  it "should build reference charge to be the same with booking extras charge description" do
    charge = build(
      :charge,
      charge_type: :e_commerce,
      booking_addons: [
        create(
          :booking_addon,
          addon: create(:addon, name: "Ski hire"),
          quantity: 2
        )
      ]
    )
    sec_charge = build(
      :charge,
      :with_ref_charge,
      ref_charge: charge,
      charge_type: :e_commerce
    )
    desc = ChargeDescriptionBuilderService.new(sec_charge).perform
    expect(desc).to eq("Booking extras charge for 2 x Ski hire")
  end

  it "should build correct auto_fee charge description no_show_unlimited" do
    charge = build(
      :charge,
      charge_type: :auto_fee,
      auto_fee_type: :no_show_unlimited
    )
    desc = ChargeDescriptionBuilderService.new(charge).perform
    expect(desc).to eq("NO SHOW + CANCEL FEE - UNLIMITED")
  end

  it "should build correct booking charge description" do
    charge = build(
      :charge,
      charge_type: :booking,
      booking: build(
        :booking,
        discount_percent: 10,
        amount: 100
      )
    )
    desc = ChargeDescriptionBuilderService.new(charge).perform
    expect(desc).to eq("Booking charge for Booking # (Discounted 10.0% = $10.00)")
  end

  it "should build correct fuel charge description" do
    charge = build(
      :charge,
      amount: 10.0,
      charge_type: :fuel,
      booking: build(
        :booking,
        id: 2
      )
    )
    desc = ChargeDescriptionBuilderService.new(charge).perform
    expect(desc).to eq("Fuel charge for Booking #2 (Used: 5.6 x $1.80)")
  end
end
