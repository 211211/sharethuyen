class BoatClassPolicy < ApplicationPolicy
  attr_reader :user, :boat_class

  def initialize(user, post)
    @user = user
    @boat_class = boat_class
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
