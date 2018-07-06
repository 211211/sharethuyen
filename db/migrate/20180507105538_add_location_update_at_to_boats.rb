class AddLocationUpdateAtToBoats < ActiveRecord::Migration[5.1]
  def change
    add_column :boats, :location_updated_at, :datetime
  end
end
