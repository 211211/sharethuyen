class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :creator_id, :latest_message_id, :member_id, :created_at, :updated_at
  has_one :creator
  has_one :member
  has_one :latest_message
end
