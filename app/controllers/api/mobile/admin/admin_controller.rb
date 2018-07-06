class Api::Mobile::Admin::AdminController < Api::Mobile::MobileController
  before_action :user_is_admin

  def user_is_admin
    unless current_user.is_admin? || current_user.is_dock?
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
