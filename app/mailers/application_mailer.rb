class ApplicationMailer < ActionMailer::Base
  default from: proc { Setting.site_email }, content_type: 'text/html'
  add_template_helper(ApplicationHelper)
  layout 'mailer'
end
