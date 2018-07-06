class StripeService

  CHARGE_STATUS = {
    succeeded: 'succeeded',
    pending: 'pending',
    failed: 'failed'
  }

  def self.create_charge(stripe_customer_id, stripeToken, amount, description = "", capture = true)
    Stripe::Charge.create({
      amount: (amount.to_i * 100).to_i,
      currency: "usd",
      customer: stripe_customer_id,
      source: stripeToken,
      description: description,
      capture: capture
    })
  end

  def self.update_charge_description(stripe_charge_id, description)
    charge = Stripe::Charge.retrieve(stripe_charge_id)
    charge.description = description
    charge.save
  end

  def self.get_default_source(stripe_customer_id)
    Stripe::Customer.retrieve(stripe_customer_id).default_source
  end

  def self.get_card(stripe_customer_id)
    stripe_customer = Stripe::Customer.retrieve(stripe_customer_id)
    {
      sources: stripe_customer.sources.data,
      default_source: stripe_customer.default_source
    }
  end

  def self.update_default_source(stripe_customer_id, default_source)
    cu = Stripe::Customer.retrieve(stripe_customer_id)
    cu.default_source = default_source
    cu.save
  end
end
