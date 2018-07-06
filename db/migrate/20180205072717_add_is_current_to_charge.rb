class AddIsCurrentToCharge < ActiveRecord::Migration[5.1]
  def change
    add_column :charges, :is_current, :boolean, default: false
  end
end
