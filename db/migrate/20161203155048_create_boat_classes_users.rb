class CreateBoatClassesUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :boat_classes_users, :id => false do |t|
      t.references :boat_class
      t.references :user
    end

    add_index :boat_classes_users, [:boat_class_id, :user_id],
      name: "boat_classes_users_index",
      unique: true
  end
end
