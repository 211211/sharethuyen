class AddCompleteNotesToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :complete_notes, :string
  end
end
