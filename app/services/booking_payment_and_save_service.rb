# Used for both booking create & booking update
class BookingPaymentAndSaveService
  def initialize(booking, staff)
    @booking = booking
    @staff = staff

    # Cache the booking new record
    # Used incase booking already persisted, ex when charge
    # it might persist the charge, lead to persit booking at that time
    @booking_new_record = booking.new_record?
  end

  def perform
    # Update the amount that will be charge
    amount_detail_result = BookingAmountDetailService.new(@booking).perform
    @booking.amount = amount_detail_result[:amount]
    @booking.amount_detail = amount_detail_result[:amount_detail]

    ActiveRecord::Base.transaction do
      # Incase change booking's dates, check for refund
      if @booking.persisted?
        BookingUpdateRefundService.new(@booking, @staff).perform 
        BookingUpdateRefundAddonService.new(@booking, @staff).perform
      end
      if @booking.payment_methods.present? && @booking.payment_methods.count.positive?
        booking_charge = CreateChargeByMethodService.new(@booking, :booking, @booking.amount_after_discounted).perform
        booking_charge.apply_sale_tax_if_needed

        if @booking.payment_methods.size > 1 && booking_charge.amount_after_tax >= @booking.user.balance
          # At this point, there is not enough user balance,
          # so next charge will be in second payment method
          @booking.payment_methods.shift
        end
      elsif @booking.amount_after_discounted.positive?
        # Front-end doesnot pass payment_methods, since from this point, user_balance is enough after refund
        @booking.charges.build(
          user: @booking.user, charge_type: :booking, source: :user_balance, amount: @booking.amount_after_discounted
        )
      end
      results = []
      @booking.charges.map do |charge|
        if charge.created? && charge.booking?
          # Proceed charge to just created booking charges
          results << PaymentService.new(charge, @booking.user, @staff).perform
        end
      end

      try_create_and_pay_e_commerce_charge if @booking_new_record && @booking.booking_addons.length.positive?

      # No charge created, there is a rare case when refund amount > total amount
      if results.blank?
        save_and_remind
      end

      if results.all? { |result| result[:key] == :success }
        save_and_remind
      end
    end
  end

  private

  def save_and_remind
    # Update the worth of the booking (include booking dates in the past)
    if @booking.persisted?
      amount_detail_result = BookingAmountDetailService.new(@booking, false).perform
      @booking.amount = amount_detail_result[:amount]
      @booking.amount_detail = amount_detail_result[:amount_detail]
    end
    @booking.save!
    BookingAfterSaveService.new(@booking, @booking_new_record).perform
  end

  def try_create_and_pay_e_commerce_charge
    charge_amount = addon_charge_amount
    return if charge_amount.zero?
    charge = CreateChargeByMethodService.new(@booking, :e_commerce, charge_amount).perform
    charge.booking_addons << @booking.booking_addons
    @booking.charges.map do |charge|
      if charge.created? && charge.e_commerce?
        # Proceed charge to just created e_commerce charges
        PaymentService.new(charge, @booking.user, @staff, @booking).perform
      end
    end
  end

  def addon_charge_amount
    amount = 0
    num_of_date = (@booking.end_date - @booking.start_date).to_i + 1
    @booking.booking_addons.each do |booking_addon|
      addon = booking_addon.addon
      booking_addon.price = addon.price
      booking_addon_price = booking_addon.quantity * addon.price if addon.per_booking?
      booking_addon_price = (booking_addon.quantity * addon.price * num_of_date) if addon.per_date?
      amount += booking_addon_price
    end
    amount
  end
end
