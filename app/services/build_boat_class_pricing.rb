class BuildBoatClassPricing
  def initialize; end

  def perform
    prices = {}

    disabled_user_types = Setting.disabled_user_types

    price_types = %w(base peak happy_hour weekend)

    price_types.each do |price_type|
      prices[price_type.upcase] = build_prices(price_type, disabled_user_types)
    end

    # Holiday PRICES
    holidays = JSON.parse(Setting.holidays)

    holidays.each do |holiday|
      prices[holiday['name']] = []

      BoatClass.order('order_number').map do |boat_class|
        prices_hash = {}

        BoatClassPrice.membership_types.keys.each do |membership_type|
          next if disabled_user_types.include?(membership_type)

          boat_class_price = BoatClassPrice.holiday.find_or_create_by(
              boat_class: boat_class,
              holiday: holiday['date'],
              membership_type: BoatClassPrice.membership_types[membership_type]
          )

          prices_hash[membership_type] = boat_class_price.price
          prices_hash["#{membership_type}_id"] = boat_class_price.id
        end

        prices[holiday['name']] << {
            boat_class_id: boat_class.id,
            boat_class_name: boat_class.name,
        }.merge(prices_hash)
      end
    end

    prices
  end

  private

  def build_prices(price_type, disabled_user_types)
    BoatClass.order('order_number').map do |boat_class|
      prices_hash = {}

      BoatClassPrice.membership_types.keys.each do |membership_type|
        next if disabled_user_types.include?(membership_type)

        boat_class_price = BoatClassPrice.find_or_create_by(
            price_type: BoatClassPrice.price_types[price_type],
            boat_class: boat_class,
            membership_type: BoatClassPrice.membership_types[membership_type]
        )

        prices_hash[membership_type] = boat_class_price.price
        prices_hash["#{membership_type}_id"] = boat_class_price.id
      end

      {
          boat_class_id: boat_class.id,
          boat_class_name: boat_class.name,
      }.merge(prices_hash)
    end
  end
end