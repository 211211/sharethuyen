class Api::Mobile::Admin::LocationController < Api::Mobile::Admin::AdminController
  def index
    date = Time.zone.today
    bookings = Booking.where("status = ?", Booking.statuses[:in_use]).order("id desc")
    render json: bookings
  end
end
