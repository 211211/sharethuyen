class RenamePriceToSupportPeakPrice < ActiveRecord::Migration[5.0]
  def change
    rename_column :boat_classes, :price, :price_season_peak
    rename_column :boat_classes, :price_hh, :price_season_peak_hh
  end
end
