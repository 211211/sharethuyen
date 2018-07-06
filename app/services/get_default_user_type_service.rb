class GetDefaultUserTypeService
  def perform
    default_user_type = Setting.default_user_type

    if default_user_type.blank? || default_user_type == 'full' || default_user_type == 'shared'
      default_user_type = 'user_single'
    end

    default_user_type.to_sym
  end
end