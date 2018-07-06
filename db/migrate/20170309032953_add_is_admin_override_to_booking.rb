class AddIsAdminOverrideToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :is_admin_override, :boolean, default: false
  end
end
