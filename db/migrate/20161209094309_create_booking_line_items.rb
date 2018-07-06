class CreateBookingLineItems < ActiveRecord::Migration[5.0]
  def change
    create_table :booking_line_items do |t|
      t.references :booking
      t.references :booking_checklist_line_item

      t.integer :value
      t.string :image
    end

    add_index :booking_line_items, [:booking_id, :booking_checklist_line_item_id],
      name: "bookings_booking_checklist_line_items_index",
      unique: true
  end
end
