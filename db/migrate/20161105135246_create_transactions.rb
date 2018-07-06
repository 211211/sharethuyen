class CreateTransactions < ActiveRecord::Migration[5.0]
  def change
    create_table :transactions do |t|
      t.references :booking, foreign_key: true
      t.references :staff, references: :users
      t.float :amount
      t.string :description
      t.integer :in_out

      t.timestamps
    end
  end
end
