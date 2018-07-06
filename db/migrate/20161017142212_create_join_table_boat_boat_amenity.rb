class CreateJoinTableBoatBoatAmenity < ActiveRecord::Migration[5.0]
  def change
    create_join_table :boats, :boat_amenities do |t|
      # t.index [:boat_id, :boat_amenity_id]
      # t.index [:boat_amenity_id, :boat_id]
    end
  end
end
