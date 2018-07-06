class AddStripeSourceIdToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :stripe_source_id, :string
  end
end
