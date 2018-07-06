class AddPriceFieldsToBoatClass < ActiveRecord::Migration[5.0]
  def change
    add_column :boat_classes, :price_hh, :float
    add_column :boat_classes, :price_season, :float
    add_column :boat_classes, :price_season_hh, :float
  end
end
