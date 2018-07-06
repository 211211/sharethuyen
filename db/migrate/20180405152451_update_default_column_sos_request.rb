class UpdateDefaultColumnSosRequest < ActiveRecord::Migration[5.1]
  def change
    change_column_default :soses, :resolved, from: nil, to: false
    change_column_default :service_requests, :resolved, from: nil, to: false
  end
end
