class AddDepartureTimeInSecAndSystemNotes < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :departure_time_in_sec, :integer, default: 0
    add_column :bookings, :system_notes, :string
  end
end
