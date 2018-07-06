class DeviseMailer < Devise::Mailer
  default from: proc { Setting.site_email }
end