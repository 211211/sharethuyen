class GroupMailer < ApplicationMailer
  def invitation_email(group, email, inviter, register_required = false)
    join_group_url = register_required ?
                         new_user_registration_url(group_id: group.id, invited_email: email) :
                         join_group_url(id: group.id, email: email)

    subject = Setting.email_group_invitation_notification_subject
    email_content = RenderEmailContent.new(
        "email_group_invitation_notification",
        { user_first_name: user.first_name, sender_full_name: inviter.full_name, join_group_url: join_group_url }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end
end