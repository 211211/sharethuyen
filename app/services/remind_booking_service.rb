class RemindBookingService
  def initialize(booking)
    @booking = booking
  end

  def perform
    # Remove reminder emails
    RemoveScheduledReminderEmailJob.perform_now(@booking.id) if @booking.persisted?

    start_booking_time = @booking.get_departure_time

    start_sending_email_time = start_booking_time - 48.hours
    if start_sending_email_time > Time.zone.now
      UpcomingBookingMailer.remind_email(@booking, @booking.user).deliver_later(wait_until: start_sending_email_time)
    end

    start_sending_email_time = start_booking_time - 7.days
    if start_sending_email_time > Time.zone.now
      UpcomingBookingMailer.remind_email(@booking, @booking.user).deliver_later(wait_until: start_sending_email_time)
    end
  end
end
