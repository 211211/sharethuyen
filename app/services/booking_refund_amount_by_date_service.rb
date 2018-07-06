class BookingRefundAmountByDateService
  def initialize(date, date_amount, cancellation_time, has_date_more_than72, sale_tax_percent)
    @date = date
    @date_amount = date_amount
    @cancellation_time = cancellation_time
    @has_date_more_than72 = has_date_more_than72
    @sale_tax_percent = sale_tax_percent
  end

  def perform
    start_time = @date.in_time_zone + 10.hours
    hours = (start_time - @cancellation_time) / 1.hour

    date_amount = @date_amount + (@date_amount * @sale_tax_percent / 100)

    refund_amount = 0
    if hours >= 72
      refund_amount = date_amount > 20 && !@has_date_more_than72 ? date_amount - 20 : date_amount
    elsif hours >= 48
      refund_amount = (date_amount / 2).round(2)
    elsif hours >= 24
      refund_amount = (date_amount / 4).round(2)
    end
    refund_amount
  end
end
