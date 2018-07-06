class CreateChargeByMethodService
  def initialize(booking, charge_type, charge_amount)
    @booking = booking
    @charge_amount = charge_amount
    @charge_type = charge_type
  end

  def perform
    return_charge = nil
    charge_params = {
      user: @booking.user,
      charge_type: @charge_type,
      amount: @charge_amount
    }
    if @booking.payment_methods.size > 1
      return_charge = split_charge_if_needed
    elsif @booking.payment_methods.first == "cash"
      charge_params[:source] = :cash
      return_charge = @booking.charges.build(charge_params)
    elsif @booking.payment_methods.first == "check"
      charge_params[:source] = :check
      return_charge = @booking.charges.build(charge_params)
    elsif @booking.payment_methods.first == "user_balance"
      charge_params[:source] = :user_balance
      return_charge = @booking.charges.build(charge_params)
    else
      charge_params[:source] = :stripe
      charge_params[:stripe_source_id] = @booking.payment_methods.first
      return_charge = @booking.charges.build(charge_params)
    end
    return_charge
  end

  private

  def split_charge_if_needed
    user_balance_charge_amount = @booking.user.balance
    if Setting.booking_charge_sale_tax
      sale_tax_percent = Setting.sale_tax_percent

      user_balance_charge_amount = 100 * @booking.user.balance / (100 + sale_tax_percent.to_f)
    end
    user_balance_charge_amount = [user_balance_charge_amount, @charge_amount].min

    ref_charge = @booking.charges.build(
      user: @booking.user,
      charge_type: @charge_type,
      source: :user_balance,
      amount: user_balance_charge_amount
    )

    return ref_charge if @charge_amount <= ref_charge.amount_after_tax
    additional_amount = @charge_amount - ref_charge.amount_after_tax
    second_charge_params = {
      user: @booking.user,
      charge_type: @charge_type,
      amount: additional_amount,
      ref_charge: ref_charge
    }

    if @booking.payment_methods.last == "cash"
      second_charge_params[:source] = :cash
    elsif @booking.payment_methods.last == "check"
      second_charge_params[:source] = :check
    else # Stripe
      second_charge_params[:source] = :stripe
    end
    @booking.charges.build(second_charge_params)
    ref_charge
  end
end
