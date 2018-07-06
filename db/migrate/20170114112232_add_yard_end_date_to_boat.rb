class AddYardEndDateToBoat < ActiveRecord::Migration[5.0]
  def change
    add_column :boats, :yard_end_date, :date
  end
end
