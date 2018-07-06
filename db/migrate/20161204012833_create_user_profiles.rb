class CreateUserProfiles < ActiveRecord::Migration[5.0]
  def change
    create_table :user_profiles do |t|
      t.string :wa_state_marine_photo
      t.string :wa_state_marine_field
      t.string :driver_license_photo
      t.string :driver_license_field
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
