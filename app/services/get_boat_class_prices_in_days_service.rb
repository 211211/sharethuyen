class GetBoatClassPricesInDaysService
  def initialize(params)
    @user = User.find params[:user_id]
    @start_date = params[:start_date].to_date
    @end_date = params[:end_date].to_date
  end

  def perform
    prices_data = []
    @user.boat_classes.each do |boat_class|
      prices = {}
      num_of_not_yard_status_boat = boat_class.boats.not_in_yard.count
      available_check = true

      @start_date.upto(@end_date).each do |date|
        availability_result = CheckClassAvailabilityByDateService.new(
          boat_class: boat_class,
          date: date,
          num_of_not_yard_status_boat: num_of_not_yard_status_boat
        ).perform

        if availability_result[:availability] == :no || (availability_result[:availability] == :half_day && date != @end_date)
          available_check = false
          break
        end

        availability_result[:price] = GetPriceService.new(@user, boat_class, date).perform if availability_result[:availability] != :no
        prices[date.to_s(:full_calendar)] = availability_result
      end
      prices_data << {prices: prices, boat_class: boat_class} if available_check
    end
    prices_data
  end
end
