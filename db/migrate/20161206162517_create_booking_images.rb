class CreateBookingImages < ActiveRecord::Migration[5.0]
  def change
    create_table :booking_images do |t|
      t.integer :photo_type, :default => 0
      t.string :image
      t.references :booking, foreign_key: true

      t.timestamps
    end
  end
end
