class GroupSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at, :pending_invitations

  has_many :users

  has_one :membership_type do
    object.membership_type
  end

end
