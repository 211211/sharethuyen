class AddCardLast4ToTransaction < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :card_last4, :string
  end
end
