class Api::Mobile::User::ProfileController < Api::Mobile::User::UserController
  def update
    if current_user.update(user_update_params)
      render json: current_user
    else
      render :json => { errors: current_user.errors }, :status => :bad_request
    end
  end

  private

  def user_update_params
    params.require(:user).permit(:profile_picture)
  end
end
