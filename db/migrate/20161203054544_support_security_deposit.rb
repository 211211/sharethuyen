class SupportSecurityDeposit < ActiveRecord::Migration[5.0]
  def change
    add_reference :users, :security_deposit_charge, references: :charges
    add_reference :charges, :user
  end
end
