
class StripeChargeStatusSyncWorker
  include Sidekiq::Worker

  # Process pending charge to sync up status with Stripe.
  # Only update status if status from Stripe is succeeded or failed
  def perform()
    pending_charges = Charge.where status: :pending

    logger.info("There are #{pending_charges.size} pending charges need to synced up!")
    pending_charges.each do |charge|

      stripe_charge = Stripe::Charge.retrieve charge.stripe_charge_id

      if stripe_charge.status.in? [StripeService::CHARGE_STATUS[:succeeded], StripeService::CHARGE_STATUS[:failed]]

        logger.info("#{charge.stripe_charge_id} got new status: #{stripe_charge.status}")

        charge.status = stripe_charge.status
        unless charge.save
          logger.error 'Cannot update charge: #{charge.errors.full_messages}'
        end
      end
    end
  end
end
