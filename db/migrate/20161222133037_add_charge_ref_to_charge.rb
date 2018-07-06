class AddChargeRefToCharge < ActiveRecord::Migration[5.0]
  def change
    add_reference :charges, :ref_charge, references: :charges
  end
end
