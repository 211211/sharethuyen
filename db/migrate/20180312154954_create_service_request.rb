class CreateServiceRequest < ActiveRecord::Migration[5.1]
  def change
    create_table :service_requests do |t|
      t.references :user, foreign_key: true
      t.references :booking, foreign_key: true
      t.string :message
      t.string :service_request_type
      t.timestamps
    end
  end
end
