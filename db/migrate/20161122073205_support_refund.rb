class SupportRefund < ActiveRecord::Migration[5.0]
  def change
    change_column :transactions, :in_out, :integer, :default => 0
    add_column :transactions, :source, :integer, :default => 0
    add_column :users, :balance, :float, :default => 0.0
  end
end
