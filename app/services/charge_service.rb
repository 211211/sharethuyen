class ChargeService
  def initialize(charge, staff, fuel_params, meta_params)
    @charge = charge
    @staff = staff
    @fuel_params = fuel_params
    @meta_params = meta_params
  end

  def check_and_create_fuel_log(charge, fuel_params = nil)
    return_data = {
      success: true
    }
    if charge.fuel?
      if fuel_params.blank? || fuel_params[:boat_id].blank? ||
        (fuel_params[:fuel_meter].blank? && fuel_params[:fuel_remain].blank?)

        return_data = {
          success: false,
          error_code: :fuel_params_missing
        }
        return return_data
      end

      fuel_meter = fuel_params[:fuel_meter]
      fuel_remain = fuel_params[:fuel_remain]
      boat = Boat.find fuel_params[:boat_id]
      boat_fuel_log = BoatFuelLog.new(
        boat_id: boat.id,
        booking_id: charge.booking_id,
        log_type: :usage,
        meter_before: boat.fuel_meter,
        meter_after: 0
      )
      if fuel_meter.present?
        boat_fuel_log.meter_before = boat.fuel_meter
        boat_fuel_log.meter_after = fuel_meter
        boat_fuel_log.fuel_meter_enabled = true
      else
        boat_fuel_log.fuel_before = boat.fuel_remain
        boat_fuel_log.fuel_after = fuel_remain
        boat_fuel_log.fuel_meter_enabled = false
      end
      return_data[:boat_fuel_log] = boat_fuel_log
      if boat_fuel_log.save
        # Update boat's fuel data
        if fuel_meter.present?
          gallon_usage = fuel_meter - boat.fuel_meter
          boat.update_attribute(:fuel_meter, fuel_meter)
          if boat.fuel_rate_of_burn > 0
            fuel_remain = (boat.fuel_remain - gallon_usage / boat.fuel_rate_of_burn).round
            boat.update_attribute(:fuel_remain, fuel_remain)
          else
            Rails.logger.info "Boat #{boat.id} fuel_rate_of_burn need > 0 to update correct data to fuel_main"
          end
        else
          boat.update_attribute(:fuel_remain, fuel_remain)
        end
      else
        return_data = {
          success: false,
          error_code: :cannot_save_fuel_log
        }
        return return_data
      end
    end
    return_data
  end

  def append_note_for_fuel_charge(fuel_log)
    boat = Boat.find @fuel_params[:boat_id]
    gallon_usage = 0
    if fuel_log.fuel_meter_enabled
      meter_before = fuel_log.meter_before
      meter_after = fuel_log.meter_after
      gallon_usage = meter_after - meter_before
    else
      fuel_before = fuel_log.fuel_before
      fuel_after = fuel_log.fuel_after
      gallon_usage = ((fuel_before - fuel_after) * boat.fuel_rate_of_burn).round(1)
    end
    @charge.note = "" if @charge.note.blank?
    @charge.note += ". " if @charge.note.present? && gallon_usage.positive?
    @charge.note += "Boat ##{boat.id} used #{gallon_usage} gallon(s)" if gallon_usage.positive?
  end

  def perform
    return_data = {
      success: true
    }
    booking = Booking.find @charge.booking_id
    user = booking.user
    charge = @charge
    return_data[:charge] = charge
    if charge.fuel?
      fuel_log = check_and_create_fuel_log(charge, @fuel_params)
      append_note_for_fuel_charge(fuel_log[:boat_fuel_log])
      if fuel_log[:success]
        charge_create_result = ChargeCreateService.new(charge, @staff, user, @meta_params).perform
        if charge_create_result[:success]
          charge_id = charge_create_result[:charge].id
          fuel_log[:boat_fuel_log].update_attribute(:charge_id, charge_id)
        else
          return_data[:success] = charge_create_result[:success]
          return_data[:error_code] = charge_create_result[:error_code]
          return_data[:message] = charge_create_result[:message]
        end
      else
        return_data[:success] = false
        return_data[:error_code] = fuel_log[:error_code]
      end
    else
      charge_create_result = ChargeCreateService.new(charge, @staff, user, @meta_params).perform
      unless charge_create_result[:success]
        return_data[:success] = charge_create_result[:success]
        return_data[:error_code] = charge_create_result[:error_code]
        return_data[:message] = charge_create_result[:message]
      end
    end
    return_data
  end
end
