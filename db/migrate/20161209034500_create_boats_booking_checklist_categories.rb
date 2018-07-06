class CreateBoatsBookingChecklistCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :boats_booking_checklist_categories, :id => false do |t|
      t.references :boat

      # index_boats_booking_checklist_categories_on_booking_checklist_category_id
      t.references :booking_checklist_category, index: { name: "boats_booking_chklist_cate_cate_id_index" }
    end

    add_index :boats_booking_checklist_categories, [:boat_id, :booking_checklist_category_id],
      name: "boats_booking_chklist_cate_index",
      unique: true
  end
end
