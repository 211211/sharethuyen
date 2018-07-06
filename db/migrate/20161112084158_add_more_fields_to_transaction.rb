class AddMoreFieldsToTransaction < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :status, :integer, :default => 0
    add_reference :transactions, :charge, foreign_key: true
  end
end
