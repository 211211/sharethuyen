class BookingValidService
  def initialize(booking)
    @booking = booking
  end

  def perform
    result_hash = check_inventory
    return result_hash if @booking.admin_use? || @booking.lesson_use?
    check_normal_booking
  end

  private
  def check_inventory
    result_hash = {
      result: :success
    }
    result_hash[:result] = :no_boat_available if @booking.no_boat_available?
    if @booking.new_record? && result_hash[:result] == :success && @booking.booking_addons.count > 0
      addon_valid_result = BookingAddonValidService.new(@booking, @booking.booking_addons).perform
      unless addon_valid_result[:success]
        result_hash[:result] = :addon_not_valid
        result_hash[:message] = addon_valid_result[:message]
      end
    end
    result_hash
  end

  def check_normal_booking
    result_hash = {
      result: :success
    }
    if @booking.booking_out_of_season?
      result_hash[:result] = :booking_out_of_season
    elsif @booking.booking_reach_limit?
      result_hash[:result] = :booking_reach_limit
    elsif !@booking.valid_boat_class?
      result_hash[:result] = :not_valid_boat_class
    elsif @booking.user.phone.blank?
      result_hash[:result] = :user_phone_is_blank
    elsif !@booking.user.is_active
      result_hash[:result] = :user_not_active
    elsif !@booking.user.has_at_least_one_chargeable_payment
      result_hash[:result] = :user_no_payment_method
    end

    if result_hash[:result] == :success
      check_valid_reserve_wday_result = BookingValidReserveWdayService.new(@booking).perform
      if check_valid_reserve_wday_result[:result] != :success
        result_hash[:result] = check_valid_reserve_wday_result[:result]
        result_hash[:message] = check_valid_reserve_wday_result[:message]
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      unless @booking.user.confirmed?
        result_hash[:result] = :email_not_verified
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      check_valid_reserve_result = BookingValidReserveSeafairService.new(@booking).perform
      if check_valid_reserve_result[:result] != :success
        result_hash[:result] = check_valid_reserve_result[:result]
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      check_valid_reserve_result = BookingValidReserveService.new(@booking, Time.zone.now).perform
      if check_valid_reserve_result[:result] != :success
        result_hash[:result] = check_valid_reserve_result[:result]
        result_hash[:message] = check_valid_reserve_result[:message]
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      check_block_out_result = BookingBlockOutService.new(@booking).perform
      if check_block_out_result[:result] != :success
        result_hash[:result] = check_block_out_result[:result]
      end
    end

    if result_hash[:result] == :success
      booking_valid_membership = @booking.booking_valid_membership?
      if booking_valid_membership[:key] != :success
        result_hash[:result] = booking_valid_membership[:msg_key]
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      one_booking_per_date = OneUserOneBookingPerDateService.new(@booking).perform
      if one_booking_per_date[:result] != :success
        result_hash[:result] = one_booking_per_date[:result]
        result_hash[:message] = one_booking_per_date[:message]
      end
    end

    if !@booking.is_admin_override && result_hash[:result] == :success
      class_waitlist_check = BoatClassWaitlistCheckService.new(@booking, Time.zone.now).perform
      if class_waitlist_check[:result] != :success
        result_hash[:result] = class_waitlist_check[:result]
        result_hash[:message] = class_waitlist_check[:message]
      end
    end

    result_hash
  end
end
