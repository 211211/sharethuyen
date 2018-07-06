class ChangeBoatCategoryToBoatClass < ActiveRecord::Migration[5.0]
  def change
    rename_table :boat_categories, :boat_classes
  end
end
