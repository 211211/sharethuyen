class BookingRefundAmountService
  def initialize(params)
    @booking = params[:booking]
    @cancellation_time = params[:cancellation_time]
    @start_date = params[:start_date].presence || @booking.start_date
    @end_date = params[:end_date].presence || @booking.end_date
    @new_start_date = params[:new_start_date]
    @new_end_date = params[:new_end_date]

    # Most of cases, booking refund will include addon_refund
    # Only when create transaction, we will seperate booking_refund vs addon_on refund
    @include_addon_refund = params[:include_addon_refund].nil? ? true : params[:include_addon_refund]
  end

  def perform
    booking_amount = @booking.calculate_paid_booking_charge
    refund_amount = 0
    if booking_amount.positive? && @booking.amount_detail.present?
      # prefer amount_detail_was used in booking edit
      if @booking.amount_detail_was.present? && @booking.amount_detail_was != @booking.amount_detail
        amount_detail = JSON.parse(@booking.amount_detail_was)
      else
        amount_detail = JSON.parse(@booking.amount_detail)
      end
      sale_tax_percent = @booking.charges.booking.first.try(:sale_tax_percent) || 0
      has_date_more_than72 = false
      @start_date.upto(@end_date) do |date|
        next if date_still_use?(date)
        date_amount = amount_detail[date.to_s] - (amount_detail[date.to_s] * @booking.discount_percent.to_f / 100)
        
        date_refund_amount = BookingRefundAmountByDateService.new(
          date, date_amount, @cancellation_time, has_date_more_than72, sale_tax_percent
        ).perform
        refund_amount += date_refund_amount

        start_time = date.in_time_zone + 10.hours
        hours = (start_time - @cancellation_time) / 1.hour
        if hours >= 72
          # Caculate refund for one day >= 72 once
          has_date_more_than72 = true
        end
      end
    end
    if @include_addon_refund && !@booking.charges.empty?
      refund_amount += paid_addons_amount
    end
    refund_amount
  end

  private

  def date_still_use?(date)
    @new_start_date.present? && @new_end_date.present? && @new_start_date <= date && date <= @new_end_date
  end

  def paid_addons_amount
    addons_amount = 0
    @booking.charges.each { |charge|
      addons_amount += charge.amount_after_tax if charge.succeeded? && charge.e_commerce?
    }
    addons_amount
  end
end
