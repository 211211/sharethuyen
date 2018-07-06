class GetBookingDataInMonthService
  def initialize(params)
    @user = User.find params[:user_id]
    @boat_class = BoatClass.find params[:boat_class_id] if params[:boat_class_id]

    # Booking to exclude, used in booking edit
    @booking_id = params[:booking_id]
    @date = params[:date].to_date
    @current_time = params[:current_time].presence || Time.zone.now

    # Since the calendar might show one week before selected month
    @calendar_start_date = @date.at_beginning_of_month.last_week
    # Since the calendar might show one week after selected month
    @calendar_end_date = @date.end_of_month.next_week.next_week
  end

  def perform
    booking_data = {}
    today = Time.zone.now.to_date
    if @boat_class
      num_of_not_yard_status_boat = @boat_class.boats.not_in_yard.count
      @calendar_start_date.upto(@calendar_end_date).each do |date|
        next if date.to_date < today

        availability_result = CheckClassAvailabilityByDateService.new(
          booking_id: @booking_id,
          boat_class: @boat_class,
          date: date,
          num_of_not_yard_status_boat: num_of_not_yard_status_boat
        ).perform
        availability_result[:price] = GetPriceService.new(@user, @boat_class, date).perform if availability_result[:availability] != :no
        booking_data[date.to_s(:full_calendar)] = availability_result
      end

      {
        booking_data: booking_data,
        boat_class:   @boat_class
      }
    else
      @calendar_start_date.upto(@calendar_end_date).each do |date|
        next if date.to_date < today
        if booking_too_late?(date)
          booking_data[date.to_s(:full_calendar)] = { availability: :no }
        else
          booking_data[date.to_s(:full_calendar)] = { availability: :full_day}
        end
      end
      {
        booking_data: booking_data
      }
    end
  end

  private

  def booking_too_late?(date)
    date == @current_time.to_date &&
      (@current_time.hour > 17 || (@current_time.hour == 17 && @current_time.min > 45))
  end
end
