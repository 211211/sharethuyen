class User::AddonsController < User::UserController
  def addon_available_for_adding
    addons = Addon.all
    addons.each do |addon|
      addon.remaining = AddonRemainingService.new(addon, params[:start_date], params[:end_date]).perform
    end
    render json: addons
  end
end
