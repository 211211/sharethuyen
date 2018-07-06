class BookingCompleteAdminMailer < ApplicationMailer

  def self.send_notification_email(booking)

    admin_users = User.with_role :admin
    admin_users.each do |admin_user|
      notification_email(admin_user.email, booking).deliver_later
    end
  end

  def notification_email(recipient, booking)
    @booking = booking
    mail(to: recipient, subject: 'Booking Notification')
  end
end
