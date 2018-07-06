require "rails_helper"

describe BookingUpdateRefundAddonService do
  it "should calculate count charged e_commerce's charges" do
    Setting.sale_tax_percent = 10
    Setting.e_commerce_charge_sale_tax = true
    booking = create(
      :booking_with_charges,
      user: create(
        :user,
        balance: 20
      )
    )
    user = create(:user)
    addon_charge = create(
      :charge,
      charge_type: :e_commerce,
      status: :succeeded,
      amount: 20
    )
    booking.charges << addon_charge
    result = BookingUpdateRefundAddonService.new(booking, user).perform
    expect(result[:key]).to eq(:success)
    expect(result[:refund_transaction].amount).to eq(20.0 + 2)
    expect(booking.user.balance).to eq(40.0 + 2)
    expect(addon_charge.refunded?).to eq(true)
  end

  it "should calculate excluded not charged e_commerce's charges" do
    booking = create(
      :booking_with_charges,
      user: create(
        :user,
        balance: 20
      )
    )
    user = create(:user)
    cleaning_charge = create(:charge,
      charge_type: :cleaning,
      status: :succeeded,
      amount: 20
    )
    not_success_e_commerce_charge = create(:charge,
      charge_type: :e_commerce,
      status: :failed,
      amount: 20
    )
    booking.charges << cleaning_charge
    booking.charges << not_success_e_commerce_charge
    result = BookingUpdateRefundAddonService.new(booking, user).perform
    expect(result[:key]).to eq(:success)
    expect(result[:refund_transaction]).to eq(nil)
    expect(booking.user.balance).to eq(20.0)
  end

  it "should cancelled all booking extras's items" do
    booking = create(
      :booking_with_charges,
      user: create(
        :user,
        balance: 20
      ),
      booking_addons: [
        create(:booking_addon,
          status: :paid
        ),
        create(:booking_addon,
          status: :unpaid
        )
      ]
    )
    user = create(:user)
    result = BookingUpdateRefundAddonService.new(booking, user).perform
    expect(result[:key]).to eq(:success)
    count = booking.booking_addons.select {|booking_addon| booking_addon.cancelled? }.count
    expect(count).to eq(2)
  end
end
