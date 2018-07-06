class CreateBoatClassWaitlists < ActiveRecord::Migration[5.1]
  def change
    create_table :boat_class_waitlists do |t|
      t.references :user, foreign_key: true
      t.references :boat_class, foreign_key: true
      t.date :date

      t.timestamps
    end
  end
end
