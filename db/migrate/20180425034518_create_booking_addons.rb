class CreateBookingAddons < ActiveRecord::Migration[5.1]
  def change
    create_table :booking_addons do |t|
      t.references :addon, foreign_key: true
      t.integer :quantity
      t.references :booking, foreign_key: true
      t.timestamps
    end
  end
end
