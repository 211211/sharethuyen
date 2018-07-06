class AddResolvedToSosServiceRequest < ActiveRecord::Migration[5.1]
  def change
    add_column :service_requests, :resolved, :boolean
    add_column :soses, :resolved, :boolean
  end
end
