class CreateBookings < ActiveRecord::Migration[5.0]
  def change
    create_table :bookings do |t|
      t.references :user, foreign_key: true
      t.references :boat_class, foreign_key: true
      t.references :boat
      t.date :start_date
      t.date :end_date
      t.string :user_notes
      t.integer :status
      t.float :amount
      t.references :assigned_staff, references: :users
      t.references :activated_staff, references: :users
      t.references :completed_staff, references: :users

      t.timestamps
    end
  end
end
