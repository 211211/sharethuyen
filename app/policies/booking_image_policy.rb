class BookingImagePolicy < ApplicationPolicy
  attr_reader :user, :booking_image

  def initialize(user, post)
    @user = user
    @booking_image = booking_image
  end

  def create?
    @user.is_admin?
  end

  def destroy?
    @user.is_admin?
  end
end
