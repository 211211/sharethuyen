class User::UserController < ApplicationController
  before_action :system_is_not_down

  private
  def system_is_not_down
    unless current_user.present? && (current_user.is_admin? || current_user.is_dock?)
      down_for_maintenance = Setting.down_for_maintenance
      if down_for_maintenance
        respond_to do |format|
          format.html do
            render "down_for_maintenance", layout: false
          end
          format.json do
            render_message_growl(t(:down_for_maintenance))
          end
        end
      end
    end
  end
end
