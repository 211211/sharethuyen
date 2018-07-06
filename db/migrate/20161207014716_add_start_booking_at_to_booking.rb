class AddStartBookingAtToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :start_booking_at, :datetime
  end
end
