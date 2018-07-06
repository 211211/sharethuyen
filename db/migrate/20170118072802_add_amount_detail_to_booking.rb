class AddAmountDetailToBooking < ActiveRecord::Migration[5.0]
  def change
    add_column :bookings, :amount_detail, :string
  end
end
