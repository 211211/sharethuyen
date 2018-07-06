class BookingUpdateRefundAddonService
  def initialize(booking, staff)
    @booking = booking
    @staff = staff
  end

  def perform
    return_result = {
      key: :success
    }
    refund_amount = cal_refund_amount
    if refund_amount > 0
      new_balance = @booking.user.balance + refund_amount
      refund_transaction = Transaction.new(
        amount: refund_amount,
        status: :succeeded,
        description: "Refund booking extras charges when change booking's dates for Booking ##{@booking.id}",
        booking: @booking,
        staff: @staff,
        source: :user_balance,
        in_out: :in,
        balance: new_balance,
        user: @booking.user
      )

      refund_transaction.save!
      return_result[:refund_transaction] = refund_transaction
      @booking.user.update_attribute(:balance, new_balance)
    end
    @booking.booking_addons.each(&:cancelled!)
    @booking.charges
    .select{ |charge| charge.e_commerce? }
    .each do |charge|
      charge.refunded! if charge.succeeded?
      if charge.created? || charge.pending? || charge.failed?
        charge.transactions.destroy_all if charge.transactions.count > 0
        charge.destroy
      end
    end
    return_result
  end

  private

  def cal_refund_amount
    refund_amount = 0
    @booking.charges.each do |charge|
      refund_amount += charge.amount_after_tax if charge.e_commerce? && charge.succeeded?
    end
    refund_amount
  end
end
