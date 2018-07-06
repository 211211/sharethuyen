class AddonChargeAmountService
  def initialize(charge)
    @charge = charge
  end

  def perform
    booking_addons = BookingAddon.where(charge_id: @charge.id)
    if booking_addons.count.positive?
      @charge.amount = booking_addons.to_a.sum(&:amount)
      @charge.save!
    else
      @charge.destroy
    end
  end
end
