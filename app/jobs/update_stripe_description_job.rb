class UpdateStripeDescriptionJob < ApplicationJob
  queue_as :default

  def perform(stripe_charge_id, charge_id)
    charge = Charge.find charge_id

    StripeService.update_charge_description(stripe_charge_id, charge.description)
  end
end
