class Admin::SettingsController < Admin::AdminController

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
      render json: setting, serializer: SettingSerializer
    else
      render json: {
        code: :no_setting_available,
        message: t(:no_setting_available)
      }
    end
  end

  def find_batch
    vars = params[:vars].split(",")
    setting = {}
    vars.each do |var|
      var_value = Setting[var]
      var_value.present? && setting[var] = var_value
    end
    render json: setting
  end

  def update_value_by_var
    setting = Setting.find_by_var params[:var]
    unless setting.present?
      setting = Setting.new(var: params[:var])
    end

    if setting.value != params[:value]
      setting.update_attribute(:value, params[:value])
    end
  end

  def update_batch
    params[:settings].each { |setting_params|
      setting = Setting.find_by_var setting_params[:key]
      unless setting.present?
        setting = Setting.new(var: setting_params[:key])
      end

      if setting.value != setting_params[:value]
        value = setting_params[:value]
        if value.instance_of? ActionController::Parameters
          value = setting_params[:value].permit!.to_h
        end
        # TODO: Better if we serialize data in JSON
        Setting[setting_params[:key]] = value

        if %w(security_deposit_single_user security_deposit_daily_user security_deposit_mid_week_user security_deposit_group_user
              security_deposit_unlimited_user membership_single_user membership_daily_user membership_mid_week_user
              membership_group_user membership_unlimited_user
              single_user_renewal_price_tier1 mid_week_user_renewal_price_tier1 group_user_renewal_price_tier1
              single_user_renewal_price_tier2 mid_week_user_renewal_price_tier2
              group_user_renewal_price_tier2).include?(setting_params[:key])
          UpdateMemberChargesJob.perform_later(setting_params[:key], setting_params[:value])
        end

        if setting_params[:key] == 'sale_tax_percent'
          UpdateSaleTaxChargesJob.perform_later(setting_params[:value])
        end
      end
    }

    @settings = Setting.get_all

    render json: { settings: @settings, message: t(:setting_update_successfully) }
  end

  def update_batch_membership_waitlist
    return_result = MembershipWaitlistUpdateService.new(params[:settings]).perform
    if return_result[:result] == :success
      render_message_growl t(:setting_update_successfully)
    else
      render_message_error_growl t(return_result[:result])
    end
  end

  # TODO: should work with update_batch, refactor needed!
  def update_branding_settings
    setting_params = params[:settings]
    setting_params.each do |key, value|
      next if key.ends_with?("_file")

      setting_value = value

      if setting_params.has_key?("#{key}_file")
        asset = SettingAsset.find_or_create_by(setting_key: key)
        asset.file = setting_params["#{key}_file".to_sym]
        asset.save

        setting_value = asset.file.url
      end

      setting = Setting.find_or_create_by(var: key)
      setting.update_attribute(:value, setting_value) if setting.value != setting_value
    end

    @settings = Setting.get_all
    render json: { settings: @settings, message: t(:setting_update_successfully) }
  end
end
