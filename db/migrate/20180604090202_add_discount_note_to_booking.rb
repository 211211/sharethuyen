class AddDiscountNoteToBooking < ActiveRecord::Migration[5.1]
  def change
    add_column :bookings, :discount_notes, :text
  end
end
