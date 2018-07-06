class AddWaitlistDeductAmountToCharges < ActiveRecord::Migration[5.1]
  def change
    add_column :charges, :waitlist_deduct_amount, :float
  end
end
