# Preview all emails at http://localhost:3000/rails/mailers/group_invitation_mailer
class GroupInvitationMailerPreview < ActionMailer::Preview
  def invite_email
    GroupInvitationMailer.invite_email(Group.first, User.first)
  end
end
