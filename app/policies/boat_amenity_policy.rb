class BoatAmenityPolicy < ApplicationPolicy
  attr_reader :user, :boat_amenity

  def initialize(user, post)
    @user = user
    @boat_amenity = boat_amenity
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
