class Admin::BoatFuelLogsController < Admin::AdminController
  def index
    render json: BoatFuelLogDatatable.new(view_context)
  end

  def fill_up
    @boat_fuel_log = BoatFuelLog.new(boat_fuel_log_params)
    boat = Boat.find @boat_fuel_log.boat_id
    if boat.fuel_remain >= 16
      render_message_error_growl(t(:fuel_tank_is_full)) and return
    end
    if @boat_fuel_log.save
      boat.update_attribute(:fuel_remain, @boat_fuel_log.fuel_after)
      render json: @boat_fuel_log
    else
      render json: {errors: @boat_fuel_log.errors}, status: :bad_request
    end
  end

  def edit_fuel
    @boat_fuel_log = BoatFuelLog.new(boat_fuel_log_params)
    boat = Boat.find @boat_fuel_log.boat_id
    new_fuel_remain = @boat_fuel_log[:fuel_after].to_i
    boat.fuel_remain == new_fuel_remain &&
      render_message_error_growl(t(:boat_fuel_cannot_change_remain_fuel_with_same_amount)) && return
    boat.fuel_remain = new_fuel_remain
    if boat.valid?
      if @boat_fuel_log.save
        boat.save
        render json: @boat_fuel_log
      else
        render json: {errors: @boat_fuel_log.errors}, status: :bad_request
      end
    else
      render json: {errors: boat.errors}, status: :bad_request
    end
  end

  def change_meter
    boat = Boat.find params[:boat_id]
    new_meter = params[:new_meter]
    boat.fuel_meter == new_meter.to_f && render_message_error_growl(t(:cannot_change_with_same_amount)) && return
    boat_fuel_log = BoatFuelLog.new(
      boat_id:      boat.id,
      log_type:     :reset_meter,
      meter_before: boat.fuel_meter,
      meter_after:  new_meter,
      note:         "Change meter from #{boat.fuel_meter} to #{new_meter}"
    )
    if boat_fuel_log.save
      boat.update_attribute(:fuel_meter, new_meter)
      render json: boat_fuel_log
    else
      render json: {errors: boat_fuel_log.errors}, status: :bad_request
    end
  end

  private

  def boat_fuel_log_params
    params.require(:boat_fuel_log).permit(:boat_id, :booking_id, :note,
                                          :charge_id, :log_type, :fuel_before, :fuel_after)
  end
end
