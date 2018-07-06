class BookingAdminAndLessonCreateService
  def initialize(booking, staff)
    @booking = booking
    @staff = staff
  end

  def perform
    amount_detail_result = BookingAmountDetailService.new(@booking).perform
    @booking.amount = amount_detail_result[:amount]
    @booking.amount_detail = amount_detail_result[:amount_detail]
    save_and_remind
  end

  private

  def save_and_remind
    @booking.save!
    BookingAfterSaveService.new(@booking, @booking_new_record).perform
  end
end
