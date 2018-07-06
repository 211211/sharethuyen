class Api::Mobile::User::LocationController < Api::Mobile::User::UserController
  before_action :get_boat, only: [:latest]
  def latest
    LocationUpdateService.new(
      params[:boat_id], params[:latitude], params[:longitude], Time.zone.now
    ).perform
    render json: @boat
  end

  private

  def get_boat
    @boat = Boat.find params[:boat_id]
  end

end
