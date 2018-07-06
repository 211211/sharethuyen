class AddReserveUntilToBoatClassWaitlist < ActiveRecord::Migration[5.1]
  def change
    add_column :boat_class_waitlists, :reserve_until, :datetime
  end
end
