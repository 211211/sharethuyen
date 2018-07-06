class GetPriceService
  def initialize(user, boat_class, date, happy_hour = false)
    @user = user
    @boat_class = boat_class
    @date = date
    @happy_hour = happy_hour

    @season_start_date = Date.parse(Setting.season_start_date)
    @season_end_date = Date.parse(Setting.season_end_date)
    @peak_season_start_date = Date.parse(Setting.peak_season_start_date)
    @peak_season_end_date = Date.parse(Setting.peak_season_end_date)
  end

  def perform
    # If happy hour
    if @happy_hour
      boat_class_price = BoatClassPrice.happy_hour.find_by(
          boat_class: @boat_class,
          membership_type: @user.membership_type
      )

      return boat_class_price.price if boat_class_price
    end

    # If holiday
    if is_holiday?(@date)
      boat_class_price = BoatClassPrice.holiday.find_by(
          boat_class: @boat_class,
          holiday: @date,
          membership_type: @user.membership_type
      )

      return boat_class_price.price if boat_class_price
    end

    # If PEAK season
    if is_in_peak_season?(@date)
      # If WEEKEND
      if @date.on_weekend?
        boat_class_price = BoatClassPrice.weekend.find_by(
            boat_class: @boat_class,
            membership_type: @user.membership_type
        )

        return boat_class_price.price if boat_class_price
      else
        boat_class_price = BoatClassPrice.peak.find_by(
            boat_class: @boat_class,
            membership_type: @user.membership_type
        )

        return boat_class_price.price if boat_class_price
      end
    end

    # If off season
    if is_in_off_season?(@date)
      boat_class_price = BoatClassPrice.base.find_by(
          boat_class: @boat_class,
          membership_type: @user.membership_type
      )

      return boat_class_price.price if boat_class_price
    end
  end

  private

  def is_holiday?(date)
    holiday_arr = JSON.parse(Setting.holidays)
    holidays = holiday_arr.map { |holiday| holiday['date'] }

    holidays.include?(date.to_s(:full_calendar))
  end

  def is_in_off_season?(date)
    (date >= @season_start_date && date < @peak_season_start_date) ||
        (date > @peak_season_end_date && date <= @season_end_date)
  end

  def is_in_peak_season?(date)
    date >= @peak_season_start_date && date <= @peak_season_end_date
  end
end