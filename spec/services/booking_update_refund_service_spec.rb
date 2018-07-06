require "rails_helper"

describe BookingUpdateRefundService do
  it "should create refund transaction with correct refund amount" do
    BookingRefundAmountService.any_instance.stub(perform: 30.0)
    booking = create(
      :booking_with_charges,
      user: create(
        :user,
        balance: 20
      )
    )
    user = create(:user)
    result = BookingUpdateRefundService.new(booking, user).perform
    expect(result[:key]).to eq(:success)
    expect(result[:refund_transaction].amount).to eq(30.0)
    expect(booking.user.balance).to eq(50.0)
  end
end
