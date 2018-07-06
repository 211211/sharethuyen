class AddAutoFeeTypeToCharge < ActiveRecord::Migration[5.1]
  def change
    add_column :charges, :auto_fee_type, :integer
  end
end
