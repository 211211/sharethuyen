class RemoveTableTodos < ActiveRecord::Migration[5.0]
  def change
    drop_table :todos, if_exists: true
  end
end
