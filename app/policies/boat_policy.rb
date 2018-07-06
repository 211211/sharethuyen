class BoatPolicy < ApplicationPolicy
  attr_reader :user, :boat

  def initialize(user, post)
    @user = user
    @boat = boat
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
