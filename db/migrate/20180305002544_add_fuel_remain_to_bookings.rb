class AddFuelRemainToBookings < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :fuel_start, :integer
    add_column :bookings, :fuel_end, :integer
  end
end
