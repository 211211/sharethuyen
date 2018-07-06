# Preview all emails at http://localhost:3000/rails/mailers/group_invitation_signup_mailer
class GroupInvitationSignupMailerPreview < ActionMailer::Preview
  def invite_email
    GroupInvitationSignupMailer.invite_email(Group.first, 'trannguyentiensu@gmail.com')
  end
end
