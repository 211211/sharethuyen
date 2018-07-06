class AddIsRenewingToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :is_renewing, :boolean, default: false
  end
end
