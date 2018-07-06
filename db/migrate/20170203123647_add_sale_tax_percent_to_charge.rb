class AddSaleTaxPercentToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :sale_tax_percent, :integer, default: 0
  end
end
