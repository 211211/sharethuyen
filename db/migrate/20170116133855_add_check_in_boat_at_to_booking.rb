class AddCheckInBoatAtToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :check_in_boat_at, :datetime
  end
end
