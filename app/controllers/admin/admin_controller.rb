class Admin::AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :user_is_admin

  #TODO: Should protect admin resources out of dock_admin resources
  def user_is_admin
    unless current_user.is_admin? || current_user.is_dock?
      user_not_authorized
    end
  end

  def admin_users
    admin_users = User.with_role(:admin).order(id: :desc)
    render json: admin_users
  end
end
