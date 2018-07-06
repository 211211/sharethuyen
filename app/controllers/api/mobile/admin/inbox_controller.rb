class Api::Mobile::Admin::InboxController < Api::Mobile::Admin::AdminController
  before_action :get_conversation, only: [:show]
  def conversations
    conversations = Conversation.where(
      "creator_id = ? or member_id = ?",
      current_user.id, current_user.id
    ).order("latest_message_id DESC")
    render json: conversations
  end

  def show
    render json: @conversation
  end

  def messages
    messages = Message.where(conversation_id: params[:conversation_id]).order("id DESC").limit(20)
    messages = messages.where("id < ?", params[:id]) if params[:id]
    render json: messages
  end

  def create
    user = User.find params[:user_id]
    conversation = ConversationCreateOrRetrieveService.new(current_user, user).perform
    message = Message.new(
      conversation: conversation,
      message_type: 0,
      sender:       current_user,
      receiver:     user,
      content:      params[:content]
    )
    if message.save
      conversation.update_attributes(latest_message_id: message.id)
      FcmSendUserService.new(
        user:  user,
        title: "#{Setting.site_name} - New message",
        body:  params[:content],
        data:  {message: message}
      ).perform
      render json: message
    else
      render json: {errors: message.errors}, status: :bad_request
    end
  end

  private

  def get_conversation
    @conversation = Conversation.find params[:id]
  end
end
