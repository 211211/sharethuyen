class AddEndorsementToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :endorsement, :text
  end
end
