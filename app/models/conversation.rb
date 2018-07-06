class Conversation < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  belongs_to :member, class_name: 'User'
  belongs_to :latest_message, class_name: 'Message'
end
