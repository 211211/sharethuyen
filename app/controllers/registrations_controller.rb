class RegistrationsController < Devise::RegistrationsController

  def new
    super
  end

  def create
    user = User.new(user_params)
    create_user_result = user.create_user
    if create_user_result[:status] == :success
      render json: user
    else
      if user.errors.count > 0
        render :json => { errors: user.errors }, :status => :bad_request
      else
        render :json => { error: create_user_result[:message] }, :status => :bad_request
      end
    end
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation,
        :first_name, :last_name, :group_id, :invited_email)
    end
end
