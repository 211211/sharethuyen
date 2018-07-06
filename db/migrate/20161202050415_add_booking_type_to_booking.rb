class AddBookingTypeToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :booking_type, :integer, :default => 0
  end
end
