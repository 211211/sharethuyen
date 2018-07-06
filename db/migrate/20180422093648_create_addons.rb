class CreateAddons < ActiveRecord::Migration[5.1]
  def change
    create_table :addons do |t|
      t.string :name
      t.integer :quantity
      t.float :price
      t.timestamps
    end
  end
end
