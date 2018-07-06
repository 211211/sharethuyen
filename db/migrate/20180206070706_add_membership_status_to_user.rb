class AddMembershipStatusToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :membership_status, :integer, default: 0
  end
end
