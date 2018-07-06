Rails.configuration.stripe = {
  :publishable_key => ENV['STRIPE_PUBLISHABLE_KEY'],
  :secret_key      => ENV['STRIPE_SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]
StripeEvent.authentication_secret = ENV['STRIPE_WEBHOOK_SECRET']

StripeEvent.configure do |events|

  events.subscribe 'charge.failed' do |event|
    Rails.logger.info 'Received charge.failed event!'
    charge_id = event.data.object.id
    charge = Charge.find_by_stripe_charge_id charge_id
    charge.failed! if charge
  end

  events.subscribe 'charge.succeeded' do |event|
    Rails.logger.info 'Received charge.succeeded event!'
    charge_id = event.data.object.id
    charge = Charge.find_by_stripe_charge_id charge_id
    charge.succeeded! if charge
  end
end
