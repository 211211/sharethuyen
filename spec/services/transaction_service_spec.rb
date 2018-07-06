require 'rails_helper'

describe TransactionService do

  describe '#build_transaction_from_stripe_charge' do
    it 'should create transaction with correct amount' do

      stripe_charge_double = double('Stripe::Charge')
      allow(stripe_charge_double).to receive(:amount).and_return(1500)
      allow(stripe_charge_double).to receive(:status).and_return(StripeService::CHARGE_STATUS[:succeeded])

      stripe_charge_source_double = double('Stripe::Source')
      allow(stripe_charge_source_double).to receive(:last4).and_return('4343')
      allow(stripe_charge_double).to receive(:source).and_return(stripe_charge_source_double)

      transaction_class_double = class_double('Transaction').as_stubbed_const({
        transfer_nested_constants: true
      })

      booking_double = double('booking')
      charge_double = double('charge')
      allow(charge_double).to receive(:charge_type).and_return(:booking)
      allow(charge_double).to receive(:id).and_return(1)
      user = build(:user)

      expect(transaction_class_double).to receive(:new).with({
        staff: user,
        amount: 15,
        balance: 50.0,
        status: StripeService::CHARGE_STATUS[:succeeded],
        booking: booking_double,
        charge: charge_double,
        source: :stripe,
        card_last4: '4343',
        description: "",
        in_out: :out
      })

      TransactionService.build_transaction_from_stripe_charge(
          user,
          stripe_charge_double,
          booking_double,
          charge_double,
          user
      )
    end

    it 'should create transaction with pending status' do

      stripe_charge_double = double('Stripe::Charge')
      allow(stripe_charge_double).to receive(:amount).and_return(1500)
      allow(stripe_charge_double).to receive(:status).and_return(StripeService::CHARGE_STATUS[:pending])

      stripe_charge_source_double = double('Stripe::Source')
      allow(stripe_charge_source_double).to receive(:last4).and_return('4343')
      allow(stripe_charge_double).to receive(:source).and_return(stripe_charge_source_double)

      transaction_class_double = class_double('Transaction').as_stubbed_const({
        transfer_nested_constants: true
      })

      booking_double = double('booking')
      charge_double = double('charge')
      allow(charge_double).to receive(:charge_type).and_return(:booking)
      allow(charge_double).to receive(:id).and_return(1)
      user = build(:user)

      expect(transaction_class_double).to receive(:new).with({
        staff: user,
        amount: 15,
        balance: 50.0,
        status: StripeService::CHARGE_STATUS[:pending],
        booking: booking_double,
        charge: charge_double,
        source: :stripe,
        card_last4: '4343',
        description: "",
        in_out: :out
      })

      TransactionService.build_transaction_from_stripe_charge(
          user,
          stripe_charge_double,
          booking_double,
          charge_double,
          user
      )
    end
  end
end
