class MessageSerializer < ActiveModel::Serializer
  attributes :id, :conversation_id, :message_type, :content, :sender_id, :receiver_id, :created_at, :updated_at
  has_one :sender
  has_one :receiver
end
