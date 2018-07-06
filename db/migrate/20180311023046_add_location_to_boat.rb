class AddLocationToBoat < ActiveRecord::Migration[5.1]
  def change
    add_column :boats, :latitude, :decimal
    add_column :boats, :longitude, :decimal
  end
end
