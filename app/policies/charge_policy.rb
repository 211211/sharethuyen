class ChargePolicy < ApplicationPolicy
  attr_reader :user, :charge

  def initialize(user, charge)
    @user = user
    @charge = charge
  end

  def create?
    @user.is_admin?
  end

  def destroy?
    @user.is_admin?
  end
end
