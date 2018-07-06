class BookingAutoFeeChargeService
  def initialize(booking, staff, cancellation_time, no_show = false)
    @booking = booking
    @staff = staff
    @cancellation_time = cancellation_time
    @no_show = no_show
  end

  def perform
    service_result = {
      result: :success
    }

    auto_fee = BookingAutoFeeService.new(@booking, @cancellation_time, @booking.user.is_unlimited?, @no_show).perform
    if auto_fee[:amount].positive?
      user = @booking.user
      balance = user.balance
      charge = @booking.charges.build(
        user: @booking.user,
        charge_type: :auto_fee,
        amount: auto_fee[:amount],
        auto_fee_type: auto_fee[:type]
      )
      if balance.round(2) < charge.amount_after_tax.round(2)
        charge.source = :stripe
        charge.set_default_source(user.id)
      else
        charge.source = :user_balance
      end
      unless charge.save
        service_result[:result] = :fail
        service_result[:error_code] = :created_charge_fail
        service_result[:message] = charge.errors.full_messages
        return service_result
      end
      pay_result = charge.pay_now(user, @staff)
      if pay_result[:result] == :fail
        service_result[:result] = :fail
        service_result[:error_code] = :charged_fail
        service_result[:message] = "Failed to charge"
        return service_result
      end
    end
    service_result
  end
end
