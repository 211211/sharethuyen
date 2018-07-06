class CreateBoatImages < ActiveRecord::Migration[5.0]
  def change
    create_table :boat_images do |t|
      t.string :image_url
      t.boolean :is_primary
      t.belongs_to :boat, foreign_key: true

      t.timestamps
    end
  end
end
