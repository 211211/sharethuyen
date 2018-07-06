class CreateSos < ActiveRecord::Migration[5.1]
  def change
    create_table :soses do |t|
      t.references :user, foreign_key: true
      t.references :booking, foreign_key: true
      t.string :message
      t.string :sos_type
      t.timestamps
    end
  end
end