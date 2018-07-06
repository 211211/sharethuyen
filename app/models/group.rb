class Group < ApplicationRecord
  validates :name, presence: true

  enum membership_type: [ :shared, :coporate ]

  has_many :users, -> { includes :membership_charges },  dependent: :restrict_with_exception

  def active_bookings(update_booking_id = nil)
    result = []
    users.each { |user|
      result += user.active_bookings(update_booking_id)
    }
    result
  end

  def active_weekend_bookings
    result = []
    self.users.each do |user|
      result += user.active_weekend_bookings
    end
    result
  end

  def paid_members
    paid_members = self.users.select { |member|
      member.membership_status == :paid.to_s
    }
    paid_members.count
  end

  def membership_status
    if self.paid_members > 1
      :paid
    else
      :failed
    end
  end

  def send_invitations(emails, inviter)
    result = []

    sent_emails = []
    emails.each do |email|
      email = email.strip
      user = User.find_by_email email
      if user.present? && user.group.present? && user.is_paid_membership_charges
        result << {
          result: :fail,
          message: "Sorry that email: #{email} is already in another group"
        }
      elsif user.present? && user.is_paid_membership_charges
        result << {
            result: :fail,
            message: "Sorry that email: #{email} can not join your group"
        }
      elsif user.present?
        GroupMailer.invitation_email(self, user.email, inviter).deliver_later
        sent_emails << email
        result << {
            result: :success,
            message: "Send group invitation to #{email} successfully!"
        }
      else
        GroupMailer.invitation_email(self, email, inviter, true).deliver_later
        sent_emails << email
        result << {
          result: :success,
          message: "Send sign up invitation to #{email} successfully!"
        }
      end
    end

    if self.pending_invitations.blank?
      pending_invitations = sent_emails.uniq.join(";")
      self.update_attribute(:pending_invitations, pending_invitations)
    else
      cur_invitations = self.pending_invitations.split(";")
      cur_invitations += sent_emails
      pending_invitations = cur_invitations.uniq.join(";")
      self.update_attribute(:pending_invitations, pending_invitations)
    end
    result
  end

  def remove_pending_invitation(email)
    invitations_in_string = self.pending_invitations || ''
    pending_invitations = invitations_in_string.split(";")
    if pending_invitations.include? email
      pending_invitations.delete(email)
      self.update_attribute(:pending_invitations, pending_invitations.join(";"))
      true
    else
      false
    end
  end

  def invitations_include?(email)
    invitations_in_string = self.pending_invitations || ''
    pending_invitations = invitations_in_string.split(";")

    pending_invitations.include? email
  end
end
