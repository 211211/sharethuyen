class CreateGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :groups do |t|
      t.integer :membership_type, :default => 0
      t.string :name

      t.timestamps
    end

    add_reference :users, :group, foreign_key: true
  end
end
