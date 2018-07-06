class Admin::BookingAddonsController < Admin::AdminController
  before_action :get_booking_addon, only: [:destroy]
  def destroy
    @booking_addon.destroy
    charge = Charge.find_by(id: @booking_addon.charge_id)
    AddonChargeAmountService.new(charge).perform if charge.present?
    render json: { charge: @booking_addon }
  end

  def find_by_booking
    render json: BookingAddon.where(booking_id: params[:booking_id])
  end

  def assign_booking_addons
    booking = Booking.find params[:booking_id]
    booking_addons = params[:booking_addons].map do |booking_addon_param|
      BookingAddon.new(
        addon_id: booking_addon_param[:addon_id],
        quantity: booking_addon_param[:quantity]
      )
    end
    validate_result = BookingAddonValidService.new(booking, booking_addons).perform
    if validate_result[:success]
      result = AddonAssignToBookingService.new(booking, booking_addons, current_user).perform
      if result[:success]
        render json: BookingAddon.where(booking_id: params[:booking_id])
      elsif result[:error_code] == :created_charge_fail
        render_message_error_growl result[:message]
      else
        render json: { errors: result[:charge].errors }, status: :bad_request
      end
    else
      render_message_error_growl t(:invalid_addon_quantity)
    end
  end

  private

  def get_booking_addon
    @booking_addon = BookingAddon.find params[:id]
  end
end
