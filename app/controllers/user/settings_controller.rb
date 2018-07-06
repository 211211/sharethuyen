class User::SettingsController < User::UserController
  def index
    @setting = Setting.get_all
    respond_to do |format|
      format.html
      format.json { render json: @setting }
    end
  end

  def get_value_by_var
    setting = Setting.find_by_var params[:var]

    if setting.present?
      render json: setting
    else
      render json: {
        message: t(:no_setting_available)
      }
    end
  end
end
