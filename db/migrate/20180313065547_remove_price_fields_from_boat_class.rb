class RemovePriceFieldsFromBoatClass < ActiveRecord::Migration[5.1]
  def change
    remove_column :boat_classes, :price_season_peak
    remove_column :boat_classes, :price_season_peak_hh
    remove_column :boat_classes, :price_season
    remove_column :boat_classes, :price_season_hh
  end
end
