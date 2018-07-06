class AddTypeToBookingLineItem < ActiveRecord::Migration[5.0]
  def change
    add_column :booking_line_items, :line_item_type, :integer, :default => 0
    add_column :booking_line_items, :value_string, :string
  end
end
