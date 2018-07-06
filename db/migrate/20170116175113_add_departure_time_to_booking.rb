class AddDepartureTimeToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :departure_time, :string
  end
end
