class Api::Mobile::Admin::BookingsController < Api::Mobile::Admin::AdminController
  def today
    offset = params[:page].to_i * num_item_per_page
    date = Time.zone.today
    bookings = Booking.where("(start_date <= ? AND end_date >= ? AND (status = ? OR status = ?)) OR (status = ?)",
      date, date, Booking.statuses[:tba], Booking.statuses[:confirmed], Booking.statuses[:in_use])
                      .order("id desc").limit(num_item_per_page).offset(offset)
    render json: bookings, include: [
      "boat.primary_image",
      "user"
    ]
  end
end
