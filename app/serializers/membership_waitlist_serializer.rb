class MembershipWaitlistSerializer < ActiveModel::Serializer
  attributes :id, :membership_type, :paid_amount, :status
end
