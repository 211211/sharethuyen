class BoatNeedAttentionService
  def initialize(current_date)
    @current_date = current_date
  end

  def perform
    boat_need_attention_on_booking + boat_need_attention_return_from_yard
  end

  private

  def boat_need_attention_on_booking
    boats = Boat.where(
      status: :need_attention
    )
    boat_results = []
    boats.each { |boat|
      last_booking = Booking.where(
        boat: boat
      ).order("id").last

      boat_result = {
        id: boat.id,
        attention_type: :booking,
        name: boat.name,
        booking_id: last_booking.try(:id)
      }
      boat_results << boat_result
    }
    boat_results
  end

  def boat_need_attention_return_from_yard 
    Boat.ransack(
      status: :yard,
      yard_end_date_eq: @current_date + 1.day
    ).result
    .select(:id, :name, :yard_end_date)
    .map do |boat|
      {
        id: boat.id,
        attention_type: :yard_remind,
        name: boat.name,
        yard_end_date: boat.yard_end_date.to_s(:full_calendar)
      }
    end
  end
end
