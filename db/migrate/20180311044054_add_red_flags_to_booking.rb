class AddRedFlagsToBooking < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :red_flags, :string
  end
end
