class AddDefaultToPriceOfBoatClassPrice < ActiveRecord::Migration[5.0]
  def change
    change_column_default :boat_class_prices, :price, 0.0
  end
end
