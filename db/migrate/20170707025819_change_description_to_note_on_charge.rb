class ChangeDescriptionToNoteOnCharge < ActiveRecord::Migration[5.0]
  def change
    rename_column :charges, :description, :note
  end
end
