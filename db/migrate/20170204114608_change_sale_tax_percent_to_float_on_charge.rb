class ChangeSaleTaxPercentToFloatOnCharge < ActiveRecord::Migration[5.0]
  def change
    change_column :charges, :sale_tax_percent, :float
  end
end
