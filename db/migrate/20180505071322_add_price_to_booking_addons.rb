class AddPriceToBookingAddons < ActiveRecord::Migration[5.1]
  def change
    add_column :booking_addons, :price, :float
  end
end
