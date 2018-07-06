class CreateBillingAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :billing_addresses do |t|
      t.references :user, foreign_key: true
      t.string :line1
      t.string :line2
      t.string :city
      t.string :state
      t.string :zip
      t.string :country

      t.timestamps
    end
  end
end
