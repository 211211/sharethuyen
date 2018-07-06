class BookingAutoFeeService
  def initialize(booking, cancellation_time, is_unlimited = false, no_show = false)
    @booking = booking
    @cancellation_time = cancellation_time
    @is_unlimited = is_unlimited
    @no_show = no_show
  end

  def perform
    start_date = @booking.start_date

    if @is_unlimited && @no_show
      return {
        amount: 75.0,
        type: :no_show_unlimited
      }
    end

    if @no_show
      return {
        amount: 25.0,
        type: :no_show
      }
    end

    if @is_unlimited
      start_time = start_date.in_time_zone + 10.hours
      hours = (start_time - @cancellation_time) / 1.hour
      if hours < 24
        return {
          amount: 50.0,
          type: :cancelled_unlimited
        }
      end
    end
    {
      amount: 0
    }
  end
end
