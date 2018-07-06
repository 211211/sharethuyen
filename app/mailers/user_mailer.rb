class UserMailer < ApplicationMailer
  include ActionView::Helpers::UrlHelper

  def welcome(user_id)
    user = User.find user_id

    subject = Setting.email_user_welcome_email_subject
    email_content = RenderEmailContent.new(
        "email_user_welcome_email",
        { user_first_name: user.first_name }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end

  def membership_waitlist_approved(user_id)
    user = User.find user_id

    subject = Setting.email_membership_waitlist_approved_notification_subject
    email_content = RenderEmailContent.new(
        "email_membership_waitlist_approved_notification",
        { user_first_name: user.first_name, login_url: new_user_session_url }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end
end
