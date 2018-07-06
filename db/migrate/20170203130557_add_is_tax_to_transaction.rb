class AddIsTaxToTransaction < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :is_tax, :boolean, default: false
  end
end
