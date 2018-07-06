class SosSerializer < ActiveModel::Serializer
  attributes  :id, :user_id, :booking_id, :message, :sos_type, 
              :created_at, :updated_at, :resolved, :conversation

  has_one :user
  has_one :booking
end
