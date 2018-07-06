class BookingChecklistCategoryPolicy < ApplicationPolicy
  attr_reader :user, :booking_checklist_category

  def initialize(user, post)
    @user = user
    @booking_checklist_category = booking_checklist_category
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
