class AddChargeToBookingAddons < ActiveRecord::Migration[5.1]
  def change
    add_reference :booking_addons, :charge, foreign_key: true
  end
end
