class ReturnBookingSecurityDepositCharges
  def initialize(staff, booking)
    @staff = staff
    @booking = booking
    @security_deposit_charge = booking.security_deposit_charge
  end

  def perform
    return if !@booking.security_deposit? || @security_deposit_charge.blank?

    ActiveRecord::Base.transaction do
      create_return_transaction
      refund_booking_security_deposit_charge
    end
  end

  private

  def refund_booking_security_deposit_charge
    stripe_charge_id = @security_deposit_charge.stripe_charge_id
    Stripe::Refund.create(charge: stripe_charge_id)
    @security_deposit_charge.update_attributes(status: :refunded, refund_amount: @security_deposit_charge.amount)
  end

  def create_return_transaction
    stripe_charge_id = @security_deposit_charge.stripe_charge_id
    stripe_charge = Stripe::Charge::retrieve(stripe_charge_id)
    transaction = TransactionService.build_transaction_from_stripe_charge(
        @staff,
        stripe_charge,
        @booking,
        @security_deposit_charge,
        @booking.user,
        Transaction.in_outs[:in],
        "Security Deposit Return - Booking ##{@booking.id}"
    )

    transaction.save!
  end
end