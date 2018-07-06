class BoatClassAvaiWaitlistMailer < ApplicationMailer
  def inform_email(waitlist)
    user = waitlist.user
    subject = Setting.email_inform_boat_class_avai_waitlist_subject
    email_content = RenderEmailContent.new(
      "email_reserve_boat_class_for_waitlist",
      {
        user_first_name: user.first_name,
        boat_class_name: waitlist.boat_class.name,
        date: waitlist.date,
        login_url: new_booking_url
      }
    ).perform
    mail(to: user.email, subject: subject, body: email_content)
  end
end
