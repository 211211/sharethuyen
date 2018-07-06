class CreateUserNotes < ActiveRecord::Migration[5.1]
  def change
    create_table :user_notes do |t|
      t.references :user, foreign_key: true
      t.text :notes

      t.timestamps
    end

    remove_column :users, :admin_notes
  end
end
