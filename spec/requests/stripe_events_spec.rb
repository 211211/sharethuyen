require 'spec_helper'

describe "Stripe Events" do
  # TODO: Correct these tests to make it works on travis
  # def stub_event(fixture_id, status = 200)
  #   stub_request(:get, "https://api.stripe.com/v1/events/#{fixture_id}").
  #     to_return(status: status, body: File.read("spec/support/fixtures/#{fixture_id}.json"))
  # end
  #
  # describe "charge.failed" do
  #   before do
  #     stub_event 'evt_charge_failed'
  #   end
  #
  #   it "is successful" do
  #     charge = Charge.create!({
  #       status: :pending,
  #       source: :stripe,
  #       amount: 100,
  #       stripe_charge_id: 'py_19YBY4AQiI9XPfDk3GiaoG3Z'
  #     })
  #     post '/stripe_event', params: { id: 'evt_charge_failed' }
  #     expect(response.code).to eq "200"
  #   end
  #
  #   it "should update pending charge to failed" do
  #     charge = Charge.create!({
  #       status: :pending,
  #       source: :stripe,
  #       amount: 100,
  #       stripe_charge_id: 'py_19YBY4AQiI9XPfDk3GiaoG3Z'
  #     })
  #
  #     post '/stripe_event', params: { id: 'evt_charge_failed' }
  #     charge.reload
  #     expect(charge.failed?).to be true
  #   end
  #
  # end
  #
  # describe "charge.succeeded" do
  #   before do
  #     stub_event 'evt_charge_succeeded'
  #   end
  #
  #   it "should update pending charge to succeeded" do
  #     charge = Charge.create!({
  #       status: :pending,
  #       source: :stripe,
  #       amount: 100,
  #       stripe_charge_id: 'py_19YBY4AQiI9XPfDk3GiaoG3Z'
  #     })
  #
  #     post '/stripe_event', params: { id: 'evt_charge_succeeded' }
  #     charge.reload
  #     expect(charge.succeeded?).to be true
  #   end
  # end
end
