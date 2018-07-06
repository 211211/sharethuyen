class AddSeasonToCharge < ActiveRecord::Migration[5.0]
  def change
    add_column :charges, :season, :integer, default: 2017
  end
end
