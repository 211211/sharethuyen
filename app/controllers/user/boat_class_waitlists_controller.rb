class User::BoatClassWaitlistsController < User::UserController
  def create
    found_waitlist = BoatClassWaitlist.find_by(
      date: waitlist_params[:date],
      boat_class_id: waitlist_params[:boat_class_id],
      user_id: current_user.id
    )
    if found_waitlist.blank?
      waitlist = BoatClassWaitlist.new(waitlist_params)
      waitlist.user = current_user
      waitlist.save!
      render json: waitlist
    else 
      render json: found_waitlist
    end
  end

  private

  def waitlist_params
    params.require(:boat_class_waitlist).permit(:date, :boat_class_id)
  end
end
