class CreateAppConfigurations < ActiveRecord::Migration[5.0]
  def change
    create_table :app_configurations do |t|
      t.string :key
      t.string :value

      t.timestamps
    end
  end
end
