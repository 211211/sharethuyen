class CreateServiceRequestResponses < ActiveRecord::Migration[5.1]
  def change
    create_table :service_request_responses do |t|
      t.references :user, foreign_key: true
      t.references :service_request, foreign_key: true
      t.string :message
      t.timestamps
    end
  end
end
