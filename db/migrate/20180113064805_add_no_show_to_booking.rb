class AddNoShowToBooking < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :no_show, :boolean
  end
end
