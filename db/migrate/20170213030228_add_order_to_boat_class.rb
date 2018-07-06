class AddOrderToBoatClass < ActiveRecord::Migration[5.0]
  def change
    add_column :boat_classes, :order_number, :integer, default: 0
  end
end
