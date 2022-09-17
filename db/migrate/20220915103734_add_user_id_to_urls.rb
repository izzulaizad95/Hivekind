class AddUserIdToUrls < ActiveRecord::Migration[6.1]
  def change
    add_column :urls, :user_id, :bigint
    add_index :urls, :user_id
  end
end
