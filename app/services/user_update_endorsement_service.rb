class UserUpdateEndorsementService
  def initialize(user, user_endorsement_params, meta_params)
    @user = user
    @user_endorsement_params = user_endorsement_params
    @meta_params = meta_params
  end

  def perform
    before_has_blank_in_required_field = @user.has_blank_in_required_field?
    if @user.update(@user_endorsement_params)
      user_profile = @user_endorsement_params["user_profile_attributes"]
      if user_profile.present? && user_profile["wa_state_marine_photo"].present?
        BookingRedFlagResolveService.new(@user, :need_wa_state_marine_photo).perform
      end
      if user_profile.present? && user_profile["driver_license_photo"].present?
        BookingRedFlagResolveService.new(@user, :need_driver_license_photo).perform
      end
      after_has_blank_in_required_field = @user.has_blank_in_required_field?
      if before_has_blank_in_required_field && !after_has_blank_in_required_field
        BookingRedFlagResolveService.new(@user, :need_field_required).perform
      end

      if @meta_params.present?
        if @meta_params[:driver_license_photo_url_del].present?
          @user.user_profile.remove_driver_license_photo!
          @user.user_profile.save!
        end
        if @meta_params[:wa_state_marine_photo_url_del].present?
          @user.user_profile.remove_wa_state_marine_photo!
          @user.user_profile.save!
        end
      end
      true
    else
      false
    end
  end
end
