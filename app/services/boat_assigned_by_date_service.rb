class BoatAssignedByDateService
  def initialize(params)
    @id = params[:id].to_i
    @kind = params[:kind]
    @date = Date.parse(params[:date])
  end

  def perform
    query_obj = {
      start_date_lteq: @date,
      end_date_gteq: @date,
      boat_id_null: 0
    }
    if @kind == 'boat_class'
      query_obj[:boat_boat_class_id_eq] = @id
    elsif @kind == 'boat'
      query_obj[:boat_id_eq] = @id
    end

    Booking.ransack(query_obj).result.count
  end
end