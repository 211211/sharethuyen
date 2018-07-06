class Api::Mobile::User::InboxController < Api::Mobile::User::UserController
  def messages
    messages =  Message
                .where(
                  "(sender_id = ? or receiver_id = ?)",
                  current_user.id, current_user.id
                )
                .order("id DESC").limit(20)
    messages = messages.where("id < ?", params[:id]) if params[:id]
    render json: messages
  end

  def create
    admin = admin_in_charge
    content = params[:content]
    message = MessageCreateService.new(
      current_user, :normal_message, content
    ).perform
    FcmSendUserService.new(
      user:  admin,
      title: "#{Setting.site_name} - New message",
      body:  params[:content],
      data:  {message: message}
    ).perform
    render json: message
  end

  def admin_in_charge
    app_admin = Setting.app_admin
    if app_admin.present?
      User.find_by email: app_admin
    else
      User.with_role(:admin).first
    end
  end
end
