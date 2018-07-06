class AddDiscountPercentToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :discount_percent, :float, default: 0
  end
end
