class Api::Mobile::User::BookingsController < Api::Mobile::User::UserController
  def latest
    latest_booking = Booking.where(
      user: current_user,
      status: :in_use
    ).order("id").last

    if latest_booking.blank?
      latest_booking = Booking.where(
        user: current_user
      ).order("id").last
    end

    if latest_booking.present?
      render json: latest_booking, include: [
        "boat.primary_image",
        "service_requests",
        "soses"
      ]
    else
      render json: {
        message: "No booking available!"
      }
    end
  end
end
