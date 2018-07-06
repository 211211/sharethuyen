class OverrideStartBookingMailer < ApplicationMailer

  def notify_email(booking, red_flags)
    @booking = booking
    @red_flags = red_flags
    admin_emails = Setting.admin_email
    mail(to: admin_emails, subject: 'Override Start Booking Notification!')
  end
end
