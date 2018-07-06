class CreateBoatClassPrices < ActiveRecord::Migration[5.0]
  def change
    create_table :boat_class_prices do |t|
      t.references :boat_class, foreign_key: true
      t.integer :price_type
      t.integer :membership_type
      t.string :holiday
      t.float :price

      t.timestamps
    end
  end
end
