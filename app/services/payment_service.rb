# TODO: This service used to replace charge.rb pay_now method
class PaymentService
  def initialize(charge, user, staff, booking = nil)
    @charge = charge
    @user = user
    @staff = staff
    @booking = booking
  end

  def perform
    pay_result = {
      key: :success,
      message: "Charge #{@charge.id} - #{@charge.charge_type_humanized} has been collected successfully"
    }
    ActiveRecord::Base.transaction do
      @charge.apply_sale_tax_if_needed
      apply_waitlist_paid_amount if @charge.membership?
      if @charge.stripe?
        pay_result = @charge.pay_now_using_stripe(@staff)
      elsif @charge.cash?
        pay_result = @charge.pay_now_using_cash(@staff)
      elsif @charge.check?
        pay_result = @charge.pay_now_using_check(@staff)
      else
        if @charge.amount_after_tax.round(2) <= @user.balance.round(2)
          new_balance = @user.balance.round(2) - @charge.amount_after_tax.round(2)
          @charge.assign_attributes(
            status: :succeeded,
            staff: @staff
          )
          if @charge.save!(validate: false)
            @user.update_attribute(:balance, new_balance)
            # Create transactions
            TransactionService.create_transactions_from_charge(@charge, @staff, new_balance)
            ChargeMailer.new_charge_email(@charge).deliver_later
          end
        else
          pay_result[:key] = :fail
          pay_result[:message] = "Can not collect charge #{@charge.id} - #{@charge.charge_type_humanized} due to not enough User Balance"
        end
      end
      if pay_result[:key] == :success
        close_waitlist_request if @charge.membership?
        update_booking_addon_status if @charge.e_commerce?
        BookingRedFlagResolveService.new(@user, :security_deposit).perform if @charge.security_deposit?
      end
    end
    pay_result
  end

  private

  def apply_waitlist_paid_amount
    current_membership_waitlist = @user.current_membership_waitlist
    return if current_membership_waitlist.blank? || current_membership_waitlist.closed?
    paid_amount = current_membership_waitlist.paid_amount
    @charge.waitlist_deduct_amount = paid_amount
    current_membership_waitlist.charge = @charge
  end

  def close_waitlist_request
    current_membership_waitlist = @user.current_membership_waitlist
    return if current_membership_waitlist.blank? || current_membership_waitlist.closed?
    current_membership_waitlist.closed!
  end

  def update_booking_addon_status
    # Persisted records
    BookingAddon
    .where(charge_id: @charge.id)
    .update_all(status: :paid)

    return if @booking.nil?
    # Un-persisted records
    @booking.booking_addons.each do |booking_addon|
      booking_addon.status = :paid if booking_addon.charge = @charge
    end
  end
end
