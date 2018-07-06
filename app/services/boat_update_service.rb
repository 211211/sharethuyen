class BoatUpdateService
  def initialize(boat, boat_params)
    @boat = boat
    @boat_params = boat_params
  end

  def perform
    @boat.boat_amenities.destroy_all
    boat_yard_update_success = BoatYardUpdateService.new(@boat, @boat_params, Date.current).perform
    return :boat_yard_update_failure unless boat_yard_update_success
    return :failure unless @boat.update(@boat_params)

    # Update primary image
    if @boat_params[:primary_image_id].present?
      BoatImage.where(boat: @boat).update_all is_primary: false
      boat_image = BoatImage.find(@boat_params[:primary_image_id])
      boat_image.is_primary = true
      boat_image.save

      # After update is_primary info
      # Should reload the @boat
      @boat.reload
    end
    :success
  end
end
