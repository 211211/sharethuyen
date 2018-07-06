class FuelUpdate < ActiveRecord::Migration[5.0]
  def change
    add_column :boats, :fuel_meter_enabled, :boolean, default: false

    # Fuel meter keep ticking all the time, admin can reset to 0
    add_column :boats, :fuel_meter, :float, default: 0

    # How many gallons per 1/16th
    add_column :boats, :fuel_rate_of_burn, :float, default: 0

    # How many 1/16th remain in the tank.
    # This can updated manually, or auto caculate from fuel_meter if fuel_meter_enabled
    add_column :boats, :fuel_remain, :integer, default: 0

    create_table :boat_fuel_logs do |t|
      t.belongs_to :boat, foreign_key: true
      t.belongs_to :booking, foreign_key: true
      t.belongs_to :charge, foreign_key: true

      # fill_up or usage
      t.integer :log_type
      t.boolean :fuel_meter_enabled, default: false
      t.float :meter_before, default: 0
      t.float :meter_after, default: 0
      t.float :fuel_before, default: 0
      t.float :fuel_after, default: 0
      t.string :note
      t.timestamps
    end
  end
end
