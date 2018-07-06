class Admin::DashboardsController < Admin::AdminController
  def index; end

  def flag_data
    today = Date.current
    render json: {
      booking_need_reassigns: BookingNeedReassignService.new(today).perform,
      boat_in_attentions: BoatNeedAttentionService.new(today).perform
    }
  end
end
