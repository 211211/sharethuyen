class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.references :sender
      t.references :receiver
      t.references :conversation
      t.integer :message_type
      t.string :content
      t.timestamps
    end
  end
end
