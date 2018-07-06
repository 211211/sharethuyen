class UpdateBoatFields < ActiveRecord::Migration[5.0]
  def change
    add_column :boats, :identifier, :string
    add_column :boats, :fuel_consumption, :string
    add_column :boats, :cruising_speed, :string
    add_column :boats, :us_coast_guard_capacity, :string
    rename_column :boats, :seat, :seating
    rename_column :boats, :mileage, :engine_hours
  end
end
