class ChargeSerializer < ActiveModel::Serializer
  attributes :id, :amount, :description, :note, :stripe_source_id, :source,
    :status, :charge_type, :created_at, :amount_after_tax, :amount_of_tax, :discount_percent, :amount_after_discounted,
             :amount_of_discount, :is_renewing, :requested_return, :waitlist_deduct_amount


  def discount_percent
    object.discount_percent.round(1)
  end

  def amount_of_discount
    object.amount_of_discount.round(1)
  end
end
