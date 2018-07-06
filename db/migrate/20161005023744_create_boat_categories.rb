class CreateBoatCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :boat_categories do |t|
      t.string :name

      t.timestamps
    end
  end
end
