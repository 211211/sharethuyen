# Preview all emails at http://localhost:3000/rails/mailers/charge_mailer
class ChargeMailerPreview < ActionMailer::Preview
  def new_charge_email
    ChargeMailer.new_charge_email(Charge.last)
  end
end
