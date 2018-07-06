# Preview all emails at http://localhost:3000/rails/mailers/booking_confirmation_mailer
class BookingMailerPreview < ActionMailer::Preview
  def confirmation_email
    BookingMailer.confirmation_email(Booking.last)
  end
end
