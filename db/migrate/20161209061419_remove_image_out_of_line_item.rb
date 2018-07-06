class RemoveImageOutOfLineItem < ActiveRecord::Migration[5.0]
  def change
    remove_column :booking_checklist_line_items, :image
  end
end
