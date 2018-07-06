class UserNote < ApplicationRecord
  belongs_to :user

  validates :notes, length: { maximum: 500 }
end
