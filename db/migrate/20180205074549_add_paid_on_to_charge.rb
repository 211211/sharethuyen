class AddPaidOnToCharge < ActiveRecord::Migration[5.1]
  def change
    add_column :charges, :paid_on, :date
  end
end
