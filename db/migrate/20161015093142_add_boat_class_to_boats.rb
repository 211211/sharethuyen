class AddBoatClassToBoats < ActiveRecord::Migration[5.0]
  def change
    add_reference :boats, :boat_class, foreign_key: true
  end
end
