class ChangeFaxToSecondaryPhone < ActiveRecord::Migration[5.1]
  def change
    rename_column :users, :fax, :secondary_phone
  end
end