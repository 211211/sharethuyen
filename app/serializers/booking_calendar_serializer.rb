class BookingCalendarSerializer < ActiveModel::Serializer
  attributes  :id, :start_date, :boat_class_name, :boat_class_color,
              :end_date, :user_surname, :status, :departure_time, :booking_type

  def boat_class_name
    object.boat_class.name
  end

  def boat_class_color
    object.boat_class.color_hex ? object.boat_class.color_hex : 'green'
  end

  def user_surname
    object.try(:user).try(:last_name)
  end

  def status
    object.status.humanize.upcase
  end
end
