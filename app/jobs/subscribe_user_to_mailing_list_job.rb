class SubscribeUserToMailingListJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)

    gibbon = Gibbon::Request.new
    gibbon.lists(ENV['MAILCHIMP_LIST_ID'])
        .members
        .create(
            body: {
                email_address: user.email,
                status: 'subscribed',
                merge_fields: {FNAME: user.first_name, LNAME: user.last_name}
            })
  end
end
