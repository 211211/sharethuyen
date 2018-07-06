class UserPolicy < ApplicationPolicy
  attr_reader :user, :user_resource

  def initialize(user, post)
    @user = user
    @user_resource = user_resource
  end

  def create?
    @user.is_admin?
  end

  def update?
    @user.is_admin?
  end

  def destroy?
    @user.is_admin?
  end

  def update_password?
    @user.is_admin?
  end

  def create_security_deposit_charge?
    @user.is_admin?
  end
end
