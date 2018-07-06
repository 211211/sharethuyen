class Admin::BookingSettingsController < Admin::AdminController
  def index
    respond_to do |format|
      format.html
    end
  end

  def check_boat_assigned
    num_of_assigned_boat = BoatAssignedByDateService.new(params).perform
    render json: {
      num_of_assigned_boat: num_of_assigned_boat
    }
  end

  def unassign_boat
    BoatUnassignByDateService.new(params).perform
    render_message_growl('Unassign boat successfully!')
  end
end
