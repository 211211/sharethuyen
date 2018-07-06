class DropTableAppConfiguration < ActiveRecord::Migration[5.0]
  def change
    drop_table :app_configurations
  end
end
