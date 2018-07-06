class AddDiscountPercentToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :discount_percent, :float, default: 0
  end
end
