class AddMembershipValidUntilToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :membership_valid_until, :date
    add_index :users, :membership_valid_until
  end
end
