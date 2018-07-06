class AddPriceStrategyToAddons < ActiveRecord::Migration[5.1]
  def change
    add_column :addons, :price_strategy, :integer
  end
end
