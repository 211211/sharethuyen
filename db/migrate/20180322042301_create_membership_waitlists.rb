class CreateMembershipWaitlists < ActiveRecord::Migration[5.1]
  def change
    create_table :membership_waitlists do |t|
      t.references :user, foreign_key: true
      t.references :charge, foreign_key: true
      t.string :membership_type
      t.float :paid_amount
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
