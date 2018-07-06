class PaymentToWaitListService
  def initialize(current_user, stripe_token, is_store_card, membership_type)
    @current_user = current_user
    @stripe_token = stripe_token
    @is_store_card = is_store_card
    @membership_type = membership_type
    @membership_waitlist_price = Setting.membership_waitlist_price.to_i
  end

  def perform
    return_result = {
      result: :success
    }
    unless Setting.membership_waitlist_enabled
      return_result[:result] = :membership_waitlist_not_enabled
      return return_result
    end
    if @membership_waitlist_price <= 0
      return_result[:result] = :membership_waitlist_price_not_set
      return return_result
    end
    if @membership_waitlist_price > @current_user.current_membership_charge.amount_after_tax
      # Rare case. Donot allow wailist price > membership price
      raise "Waitlist price must be smaller than membership price"
    end
    charge_h = {
      amount: @membership_waitlist_price * 100,
      currency: "usd",
      description: "Membership waiting list fee"
    }
    if @is_store_card
      card_source = save_card_source_to_user
      charge_h[:source] = card_source[:id]
      charge_h[:customer] = card_source[:customer]

      # Reload customer to get updated sources
      customer = Stripe::Customer.retrieve @current_user.stripe_customer_id
      return_result[:sources] = customer.sources.data
    else
      charge_h[:source] = @stripe_token
    end
    stripe_charge = Stripe::Charge.create(charge_h)
    @current_user.membership_waitlists.build(
      status: :requested, paid_amount: @membership_waitlist_price, membership_type: @membership_type
    )
    @current_user.transactions.build(
      amount: stripe_charge.amount / 100.0,
      balance: @current_user.balance,
      status: stripe_charge.status,
      staff: @current_user,
      source: :stripe,
      card_last4: stripe_charge.source.last4,
      description: "Membership waiting list fee"
    )
    @current_user.save!
    return_result[:membership_waitlist] = @current_user.membership_waitlists.last
    return_result
  end

  private

  def save_card_source_to_user
    if @current_user.stripe_customer_id.present?
      customer = Stripe::Customer.retrieve(@current_user.stripe_customer_id)
    else
      customer = Stripe::Customer.create(
        email: @current_user.email
      )
      @current_user.update_attribute(:stripe_customer_id, customer.id)
    end
    customer.sources.create(
      source: @stripe_token
    )
  end
end
