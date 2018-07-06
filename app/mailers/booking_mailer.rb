class BookingMailer < ApplicationMailer

  def confirmation_email(booking)
    subject = Setting.email_booking_confirmation_notification_subject
    email_content = RenderEmailContent.new(
        "email_booking_confirmation_notification",
        { user_first_name: booking.user.first_name, booking_confirmation_details: booking }
    ).perform

    mail(to: booking.user.email, subject: subject, body: email_content)
  end

  def completed_notification(booking, yelp = false)
    subject = Setting.email_booking_completed_notification_subject
    email_content = RenderEmailContent.new(
        "email_booking_completed_notification",
        { user_first_name: booking.user.first_name, booking_completed_details: booking, yelp_review_url: yelp }
    ).perform

    mail(to: booking.user.email, subject: subject, body: email_content)
  end
end
