#
# Used to build amount / amount detail of a booking
# will_be_charged mean this amount used to create charge to the user
# !will_be_charged mean this amount is current booking's worth. Included amount already pay in the past
#
class BookingAmountDetailService
  def initialize(booking, will_be_charged = true)
    @booking = booking
    @will_be_charged = will_be_charged
  end

  def perform
    start_date = @booking.start_date
    end_date = @booking.end_date
    boat_class = @booking.boat_class
    user = @booking.user
    happy_hour = @booking.happy_hour?

    amount_detail = {}
    amount_detail_was = {}
    amount_detail_was = JSON.parse(@booking.amount_detail_was) if @booking.amount_detail_was.present?
    start_date.upto(end_date).each do |date|
      # skip for those already paid in the past
      next if @booking.persisted? && @will_be_charged && date_still_use?(date)
      amount_detail[date.to_s] =
        amount_detail_was[date.to_s] || GetPriceService.new(user, boat_class, date, happy_hour).perform
    end
    {
      amount: amount_detail.values.sum,
      amount_detail: amount_detail.to_json
    }
  end

  private

  def date_still_use?(date)
    start_date = @booking.start_date_was || @booking.start_date
    end_date = @booking.end_date_was || @booking.end_date
    start_date <= date && date <= end_date
  end
end
