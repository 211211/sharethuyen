class CreateBoats < ActiveRecord::Migration[5.0]
  def change
    create_table :boats do |t|
      t.string :title
      t.string :description
      t.integer :year

      t.timestamps
    end
  end
end
