class AddRequestedReturnToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :requested_return, :boolean, default: false
  end
end
