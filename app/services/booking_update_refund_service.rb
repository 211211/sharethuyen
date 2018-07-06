# Refund when admin change booking dates
class BookingUpdateRefundService
  def initialize(booking, staff)
    @booking = booking
    @staff = staff
  end

  def perform
    return_result = {
      key: :success
    }

    refund_amount = BookingRefundAmountService.new(
      booking:           @booking,
      cancellation_time: Time.zone.now,
      start_date: @booking.start_date_was,
      end_date: @booking.end_date_was,
      new_start_date: @booking.start_date,
      new_end_date: @booking.end_date,
      include_addon_refund: false
    ).perform
    return return_result if refund_amount <= 0
    new_balance = @booking.user.balance + refund_amount
    refund_transaction = Transaction.new(
      amount: refund_amount,
      status: :succeeded,
      description: "Refund when change booking's dates for Booking ##{@booking.id}",
      booking: @booking,
      staff: @staff,
      source: :user_balance,
      in_out: :in,
      balance: new_balance,
      user: @booking.user
    )

    if refund_transaction.save
      @booking.user.update_attribute(:balance, new_balance)
      return_result[:refund_transaction] = refund_transaction
    else
      return_result[:key] = :fail
      return_result[:message] = refund_transaction.errors.full_messages.join(", ")
    end
    return_result
  end
end
