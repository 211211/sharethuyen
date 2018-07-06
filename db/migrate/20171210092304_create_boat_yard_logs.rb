class CreateBoatYardLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :boat_yard_logs do |t|
      t.references :boat, foreign_key: true
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
