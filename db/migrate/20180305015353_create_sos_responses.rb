class CreateSosResponses < ActiveRecord::Migration[5.1]
  def change
    create_table :sos_responses do |t|
      t.references :user, foreign_key: true
      t.references :sos, foreign_key: true
      t.string :message
      t.timestamps
    end
  end
end
