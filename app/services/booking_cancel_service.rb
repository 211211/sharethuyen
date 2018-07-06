#
# Logic of cancellation a booking:
# 1. Calculate refund amount
# 2. Add refund amount to user_balance
# 3. Create transaction for tracking purpose
# 4. Create auto fee charge on user_balance or
# 5. Inform to waitlist if any
#
class BookingCancelService
  def initialize(booking, current_user, cancellation_time)
    @booking = booking
    @current_user = current_user
    @cancellation_time = cancellation_time
  end

  def perform
    cancel_booking_result = {
      key: :success
    }

    refund_amount = BookingRefundAmountService.new(
      booking:           @booking,
      cancellation_time: @cancellation_time
    ).perform
    if refund_amount.positive?

      paid_booking_amount_no_tax = @booking.calculate_paid_booking_charge

      sale_tax_percent = @booking.charges.booking.first.try(:sale_tax_percent) || 0
      paid_booking_amount = paid_booking_amount_no_tax + (paid_booking_amount_no_tax * sale_tax_percent / 100)

      new_balance = @booking.user.balance + paid_booking_amount

      amount_of_tax = paid_booking_amount_no_tax * sale_tax_percent / 100

      refund_transaction = Transaction.new({
        amount: paid_booking_amount,
        status: :succeeded,
        description: "Refund for Booking ##{@booking.id}, #{sale_tax_percent}% WA sales tax included = #{ActionController::Base.helpers.number_to_currency(amount_of_tax)}",
        booking: @booking,
        staff: @current_user,
        source: :user_balance,
        in_out: :in,
        balance: new_balance,
        user: @booking.user
      })

      cancellation_fee = paid_booking_amount - refund_amount

      new_balance -= cancellation_fee

      cancellation_transaction = Transaction.new({
        amount: cancellation_fee,
        status: :succeeded,
        description: "Cancellation fee for Booking ##{@booking.id}",
        booking: @booking,
        staff: @current_user,
        source: :user_balance,
        in_out: :out,
        balance: new_balance,
        user: @booking.user
      })

      if refund_transaction.invalid? || cancellation_transaction.invalid?
        cancel_booking_result[:key] = :fail
        if refund_transaction.invalid?
          cancel_booking_result[:message] = refund_transaction.errors.full_messages.join(', ')
        else
          cancel_booking_result[:message] = cancellation_transaction.errors.full_messages.join(', ')
        end
      else
        refund_transaction.save
        cancellation_transaction.save
        @booking.user.update_attribute(:balance, new_balance)
        @booking.update_attribute(:status, :cancelled)

        # Remove reminder emails
        RemoveScheduledReminderEmailJob.perform_later(@booking.id)
      end
    else
      @booking.update_attribute(:status, :cancelled)

      # Remove reminder emails
      RemoveScheduledReminderEmailJob.perform_later(@booking.id)
    end

    auto_fee_charge_result = BookingAutoFeeChargeService.new(@booking, @current_user, @cancellation_time).perform
    unless auto_fee_charge_result[:result] == :success
      cancel_booking_result[:key] = :fail
      cancel_booking_result[:error_code] = :auto_fee_charge_fail
      cancel_booking_result[:message] = auto_fee_charge_result[:message]
    end

    BoatClassWaitlistInformService.new(@booking).perform if cancel_booking_result[:key] == :success
    cancel_booking_result
  end
end
