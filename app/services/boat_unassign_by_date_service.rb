class BoatUnassignByDateService
  def initialize(params)
    @id = params[:id].to_i
    @kind = params[:kind]
    @date = Date.parse(params[:date])
  end

  def perform
    query_obj = {
      start_date_lteq: @date,
      end_date_gteq: @date
    }
    if @kind == 'boat_class'
      query_obj[:boat_boat_class_id_eq] = @id
    elsif @kind == 'boat'
      query_obj[:boat_id_eq] = @id
    end

    bookings = Booking.ransack(query_obj).result
    bookings.each { |booking|
      if booking.boat.present?
        booking.update_attribute(:boat_id, nil)
      end
    }
  end
end