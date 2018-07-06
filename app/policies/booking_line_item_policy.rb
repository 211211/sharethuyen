class BookingLineItemPolicy < ApplicationPolicy
  attr_reader :user, :booking_line_item

  def initialize(user, post)
    @user = user
    @booking_line_item = booking_line_item
  end

  def create?
    @user.is_admin?
  end

  def update?
    @user.is_admin?
  end

  def destroy_image?
    @user.is_admin?
  end
end
