class BoatAssignService
  def initialize(booking, boat_id, override_confirmed, current_time)
    @booking = booking
    @boat_id = boat_id
    @override_confirmed = override_confirmed
    @current_time = current_time
  end

  def perform
    return_result = {
      result: :success
    }
    unless @booking.tba? || @booking.confirmed? || @booking.in_use?
      return_result[:result] = :fail
      return_result[:errors] = ["You can not reassign boat for #{@booking.status} booking"]
      return return_result
    end
    previous_boat = @booking.boat
    boat = Boat.find @boat_id
    @booking.system_notes = "" if @booking.system_notes.nil?
    @booking.system_notes += "\n" if @booking.system_notes.present?
    @booking.system_notes += "#{@current_time} - Boat ##{@boat_id} #{boat.name} was assigned"
    @booking.system_notes += " [Admin Confirmed Overriden]" if @override_confirmed
    @booking.boat_id = @boat_id
    @booking.status = :confirmed if @booking.tba?
    if @booking.save
      previous_boat.dock! if previous_boat.present? && previous_boat.in_use? && @booking.in_use?
      return_result[:booking] = @booking
    else
      return_result[:result] = :fail
      return_result[:errors] = @booking.errors
    end
    return_result
  end
end
