class LessonPolicy < ApplicationPolicy
  attr_reader :user, :lesson

  def initialize(user, post)
    @user = user
    @lesson = lesson
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
