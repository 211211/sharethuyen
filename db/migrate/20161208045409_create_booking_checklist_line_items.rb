class CreateBookingChecklistLineItems < ActiveRecord::Migration[5.0]
  def change
    create_table :booking_checklist_line_items do |t|
      t.string :name
      t.string :image
      t.references :category, references: :booking_checklist_categories

      t.timestamps
    end
  end
end
