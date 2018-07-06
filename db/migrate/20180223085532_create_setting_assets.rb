class CreateSettingAssets < ActiveRecord::Migration[5.1]
  def change
    create_table :setting_assets do |t|
      t.string :setting_key
      t.text :file

      t.timestamps
    end
  end
end
