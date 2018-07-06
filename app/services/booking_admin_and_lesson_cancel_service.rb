class BookingAdminAndLessonCancelService
  def initialize(booking)
    @booking = booking
  end

  def perform
    @booking.update_attribute(:status, :cancelled)
    RemoveScheduledReminderEmailJob.perform_later(@booking.id)
    BoatClassWaitlistInformService.new(@booking).perform
  end
end
