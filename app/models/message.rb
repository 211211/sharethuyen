class Message < ApplicationRecord
  belongs_to :sender, class_name: 'User'
  belongs_to :receiver, class_name: 'User'
  belongs_to :conversation
  enum message_type: [:normal_message, :sos_message, :service_message]
end
