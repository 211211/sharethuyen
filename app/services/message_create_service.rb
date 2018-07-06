class MessageCreateService
  def initialize(sender, message_type, content)
    @sender = sender
    @message_type = message_type
    @content = content
  end

  def perform
    admin = admin_in_charge
    conversation = ConversationCreateOrRetrieveService.new(@sender, admin).perform
    message = Message.new(
      conversation: conversation,
      message_type: @message_type,
      sender:       @sender,
      receiver:     admin,
      content:      @content
    )
    message.save!
    conversation.update_attributes(latest_message_id: message.id)
    message
  end

  private

  def admin_in_charge
    app_admin = Setting.app_admin
    if app_admin.present?
      User.find_by email: app_admin
    else
      User.with_role(:admin).first
    end
  end
end
