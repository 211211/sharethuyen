class AddStatusToBookingAddons < ActiveRecord::Migration[5.1]
  def change
    add_column :booking_addons, :status, :integer
  end
end
