class Admin::BoatClassWaitlistsController < User::UserController
  def index
    respond_to do |format|
      format.html
      format.json { render json: BoatClassWaitlistDatatable.new(view_context) }
    end
  end

  def create
    found_waitlist = BoatClassWaitlist.find_by waitlist_params
    if found_waitlist.blank?
      waitlist = BoatClassWaitlist.new(waitlist_params)
      waitlist.save!
      render json: waitlist
    else 
      render json: found_waitlist
    end
  end

  def destroy
    waitlist = BoatClassWaitlist.find(params[:id])
    waitlist.destroy
    render json: waitlist
  end

  private

  def waitlist_params
    params.require(:boat_class_waitlist).permit(:date, :boat_class_id, :user_id)
  end
end
