class AddStatusToBoats < ActiveRecord::Migration[5.0]
  def change
    add_column :boats, :status, :integer, :default => 0
  end
end
