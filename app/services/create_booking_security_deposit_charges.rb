class CreateBookingSecurityDepositCharges
  def initialize(staff, booking, deposit_params = {})
    @staff = staff
    @booking = booking
    @deposit_params = deposit_params
    @amount = @deposit_params[:security_deposit_amount].to_i
    @stripe_token = @deposit_params[:security_deposit_stripe_token]
  end

  def perform
    return if @deposit_params.blank? || !@deposit_params[:security_deposit]

    ActiveRecord::Base.transaction do
      charge = create_charge
      transaction = TransactionService.create_transactions_from_charge(charge, @staff, @booking.user.balance)
      stripe_charge = create_stripe_charge(charge)
      update_charge_from_stripe(charge, transaction, stripe_charge)
    end
  end

  private

  def create_charge
    Charge.booking_security_deposit.create!(
        status: Charge.statuses[:succeeded],
        booking: @booking,
        source: Charge.sources[:stripe],
        stripe_source_id: @stripe_token,
        user: @booking.user,
        amount: @amount,
        staff: @staff
    )
  end

  def create_stripe_charge(charge)
    user = @booking.user
    StripeService.create_charge(
        user.stripe_customer_id,
        @stripe_token,
        @amount,
        charge.description,
        false
    )
  end

  def update_charge_from_stripe(charge, transaction, stripe_charge)
    charge.update_columns(stripe_charge_id: stripe_charge.id)
    transaction.update_columns(card_last4: stripe_charge.source.last4)
    @booking.update_columns(security_deposit: true, security_deposit_amount: @amount)
  end
end