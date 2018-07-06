class CreateCharges < ActiveRecord::Migration[5.0]
  def change
    create_table :charges do |t|
      t.string :stripe_charge_id
      t.references :booking, foreign_key: true
      t.string :description
      t.float :amount
      t.integer :status, :default => 0
      t.integer :charge_type, :default => 0
      t.references :staff, references: :users
      t.float :refund_amount

      t.timestamps
    end
  end
end
