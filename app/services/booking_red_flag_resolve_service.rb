class BookingRedFlagResolveService

  def initialize(user, flag_type)
    @user = user
    @flag_type = flag_type
  end

  def perform
    booking_with_flags = @user.bookings.where.not(red_flags: nil)
    return if booking_with_flags.empty?
    if @flag_type == :security_deposit
      remove_flag(booking_with_flags, 'need_security_deposit')
    elsif @flag_type == :need_wa_state_marine_photo
      remove_flag(booking_with_flags, 'need_wa_state_marine_photo')
    elsif @flag_type == :need_driver_license_photo
      remove_flag(booking_with_flags, 'need_driver_license_photo')
    elsif @flag_type == :need_field_required
      remove_flag(booking_with_flags, 'need_field_required')
    end
  end

  private
  def remove_flag(booking_with_flags, flag)
    booking_with_flags.each do |booking|
      if booking.red_flags.present?
        red_flags = JSON.parse(booking.red_flags)
        if red_flags.include? flag
          red_flags -= [flag]
          red_flags_updated = red_flags.length == 0 ? nil : red_flags.as_json
          booking.update_attribute(:red_flags, red_flags_updated)
        end
      end
    end
  end
end