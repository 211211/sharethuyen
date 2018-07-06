class Api::Mobile::User::UserController < Api::Mobile::MobileController
  before_action :user_logged_in?

  def user_logged_in?
    unless current_user.present?
      user_not_authorized
    end
  end

  private
  def user_not_authorized
    message = "You are not authorized to perform this action."
    self.status = :unauthorized
    render json: { error: message }
  end
end
