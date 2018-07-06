require 'rails_helper'

describe StripeService do

  before(:all) do
    @stripe_customer_id = 'cus_9ToS6QeHo2QSMr'
    @card_token = 'card_19AqpvAQiI9XPfDkj3o4nrcJ'
  end
  describe '#create_stripe_charge' do
    it 'calls Stripe::Charge with correct amount' do

      stripe_charge_class_double = class_double("Stripe::Charge").as_stubbed_const({
        transfer_nested_constants: true
      })

      stripe_charge_double = double('Stripe::Charge')
      allow(stripe_charge_class_double).to receive(:create).and_return(stripe_charge_double)

      expect(stripe_charge_class_double).to receive(:create).with({
        amount: 200,
        currency: "usd",
        customer: @stripe_customer_id,
        source: @card_token,
        description: "",
        capture: true
      })

      StripeService.create_charge(@stripe_customer_id, @card_token, 2)
    end

    it 'return correct charge_id' do

      charge_id = 'ch_22DDaJAQiI9XPfDkLFKBJQJT'

      stripe_charge_class_double = class_double("Stripe::Charge").as_stubbed_const({
        transfer_nested_constants: true
      })

      stripe_charge_double = double('Stripe::Charge')
      allow(stripe_charge_class_double).to receive(:create).and_return(stripe_charge_double)

      allow(stripe_charge_double).to receive(:id).and_return(charge_id)

      expect(StripeService.create_charge(@stripe_customer_id, @card_token, 2).id eq(charge_id))
    end
  end

  describe '#get_default_source' do
    it 'return correct default source' do

      stripe_customer_class_double = class_double("Stripe::Customer").as_stubbed_const({
        transfer_nested_constants: true
      })

      stripe_customer_double = double('Stripe::Customer')
      allow(stripe_customer_class_double).to receive(:retrieve).and_return(stripe_customer_double)
      allow(stripe_customer_double).to receive(:default_source).and_return('card_19BQSIAQiI9XPfDkUDEq4m0j')

      expect(StripeService.get_default_source('cus_9UPGKkgDrQJHIx')).to eq('card_19BQSIAQiI9XPfDkUDEq4m0j')
    end
  end
end
