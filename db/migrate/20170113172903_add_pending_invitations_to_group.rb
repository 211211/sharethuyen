class AddPendingInvitationsToGroup < ActiveRecord::Migration[5.0]
  def change
    add_column :groups, :pending_invitations, :string
  end
end
