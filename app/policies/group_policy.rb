class GroupPolicy < ApplicationPolicy
  attr_reader :user, :group

  def initialize(user, group)
    @user = user
    @group = group
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
end
