class BookingPolicy < ApplicationPolicy
  attr_reader :user, :booking

  def initialize(user, post)
    @user = user
    @booking = booking
  end

  def create?
    @user.is_admin? || @user.is_dock?
  end

  def update?
    @user.is_admin? || @user.is_dock?
  end

  def start_booking?
    @user.is_admin? || @user.is_dock?
  end

  def complete_booking?
    @user.is_admin? || @user.is_dock?
  end

  def destroy?
    @user.is_admin?
  end
end
