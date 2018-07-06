class PasswordsController < Devise::PasswordsController

  def new
  end

  def create
    user = User.find_by_email params[:email]
    if user.present?
      user.send_reset_password_instructions
      render_message_growl t(:reset_password_sent)
    else
      render_message_error_growl t(:not_exist_user_by_email)
    end
  end

  def edit
  end

  def update
    user_param = params.fetch(:user)
    resource = User.reset_password_by_token user_param

    if resource.errors.empty?
      render_message_growl t(:reset_password_sent)
    else
      render :json => { errors: resource.errors }, :status => :bad_request
    end
  end

end
