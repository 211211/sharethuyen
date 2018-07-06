class ChargeMailer < ApplicationMailer
  include ActionView::Helpers::NumberHelper

  def new_charge_email(charge)
    user = charge.user || charge.booking.user
    subject = Setting.email_new_charge_notification_subject
    email_content = RenderEmailContent.new(
        "email_new_charge_notification",
        { user_first_name: user.first_name, charge_details: charge }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end

  def request_deposit_return_admin_email(user_id)
    @user = User.find user_id
    email = Setting.admin_email
    raise "Admin Email haven't configured yet!" if email.blank?
    mail(to: email, subject: "#{@user.full_name} has requested deposit return")
  end

  def returned_deposit_charge_email(user_id, charge_id, method)
    time = Time.zone.now
    user = User.find user_id
    charge = Charge.find charge_id
    method_name = case method
                    when 1
                      'ACH'
                    when 2
                      'CASH'
                    when 3
                      'CHECK'
                    when 4
                      'CARD'
                    else
                      'CASH'
                  end

    subject = Setting.email_deposit_returned_notification_subject
    email_content = RenderEmailContent.new(
        "email_deposit_returned_notification",
        {
            user_first_name: user.first_name,
            returned_amount: number_to_currency(charge.amount_after_tax),
            returned_time: time.to_s,
            returned_method: method_name
        }
    ).perform

    mail(to: user.email, subject: subject, body: email_content)
  end
end
