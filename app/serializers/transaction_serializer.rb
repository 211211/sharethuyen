class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :amount, :description, :source, :card_last4,
    :in_out, :created_at

  def created_at
    object.created_at.to_s
  end
end
