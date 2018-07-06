class BoatYardWarningMailer < ApplicationMailer

  def warning_email(boats, back_date)
    @boats = boats
    @back_date = back_date
    admin_emails = Setting.admin_email
    mail(to: admin_emails, subject: 'Back from Yard Warning')
  end
end
