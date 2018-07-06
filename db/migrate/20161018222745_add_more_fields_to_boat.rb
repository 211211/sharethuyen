class AddMoreFieldsToBoat < ActiveRecord::Migration[5.0]
  def change
    add_column :boats, :length, :integer
    add_column :boats, :engine, :string
    add_column :boats, :mileage, :integer
    add_column :boats, :seat, :integer
    add_column :boats, :bathroom, :integer
    add_column :boats, :capacity, :integer
    rename_column :boats, :title, :name
  end
end
