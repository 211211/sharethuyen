class AddSecurityDepositToBooking < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :security_deposit, :boolean, default: false
    add_column :bookings, :security_deposit_amount, :float, default: 0.0
  end
end
