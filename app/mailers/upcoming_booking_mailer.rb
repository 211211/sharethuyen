class UpcomingBookingMailer < ApplicationMailer

  def remind_email(booking, user)
    red_flag = user.red_flag

    subject = Setting.email_booking_reminder_subject
    email_content = RenderEmailContent.new(
        "email_booking_reminder",
        { user_first_name: user.first_name, booking_details: booking, redflag: red_flag }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end
end
