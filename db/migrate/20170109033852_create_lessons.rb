class CreateLessons < ActiveRecord::Migration[5.0]
  def change
    create_table :lessons do |t|
      t.string :name
      t.text :description
      t.float :price
      t.string :icon

      t.timestamps
    end
  end
end
