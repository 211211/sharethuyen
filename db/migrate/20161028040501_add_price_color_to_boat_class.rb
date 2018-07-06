class AddPriceColorToBoatClass < ActiveRecord::Migration[5.0]
  def change
    add_column :boat_classes, :price, :float
    add_column :boat_classes, :color_hex, :string
  end
end
