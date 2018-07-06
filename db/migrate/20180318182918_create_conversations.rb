class CreateConversations < ActiveRecord::Migration[5.1]
  def change
    create_table :conversations do |t|
      t.references :creator
      t.references :member
      t.integer :latest_message_id
      t.timestamps
    end
  end
end
