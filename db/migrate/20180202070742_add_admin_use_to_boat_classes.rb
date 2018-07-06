class AddAdminUseToBoatClasses < ActiveRecord::Migration[5.1]
  def change
    add_column :boat_classes, :admin_use, :boolean, default: false
  end
end
