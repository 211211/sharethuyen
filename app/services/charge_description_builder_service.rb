class ChargeDescriptionBuilderService

  def initialize(charge)
    @charge = charge
  end

  def perform
    charge = @charge
    desc = charge.discount_percent > 0 ? "#{charge.charge_type_humanized} charge (Discounted #{charge.discount_percent.round(1)}% = #{ActionController::Base.helpers.number_to_currency(charge.amount_of_discount)})" :
        "#{charge.charge_type_humanized} charge"

    if charge.booking?
      desc = charge.booking.discount_percent.to_f > 0  ?
          "#{charge.charge_type_humanized} charge for Booking ##{charge.booking.id} (Discounted #{charge.booking.discount_percent.round(1)}% = #{ActionController::Base.helpers.number_to_currency(charge.booking.amount_of_discount)})" :
          "#{charge.charge_type_humanized} charge for Booking ##{charge.booking.id}"

      desc = "#{charge.charge_type_humanized} charge for Booking ##{charge.booking.id} - UBM" if charge.user.try(:membership_type) == 'unlimited'
    elsif charge.fuel?
      gallon_price = charge.settings.gallon_price.to_f
      used_gallon = charge.amount_after_discounted / gallon_price
      desc = "#{charge.charge_type_humanized} charge for Booking ##{charge.booking.id} (Used: #{used_gallon.round(1)} x #{ActionController::Base.helpers.number_to_currency(gallon_price)})"
    end

    if charge.waitlist_deduct_amount.present?
      desc = "#{desc}. Prepaid membership waitlist: #{ActionController::Base.helpers.number_to_currency(charge.waitlist_deduct_amount)}"
    end

    if charge.auto_fee?
      desc =  case charge.auto_fee_type.to_sym
              when :no_show_unlimited
                Setting.no_show_cancel_fee_unlimited_msg
              when :cancelled_unlimited
                Setting.cancel_fee_unlimited_msg
              else
                Setting.no_show_fee_msg
              end
    end

    if charge.e_commerce?
      return charge.ref_charge.description if charge.ref_charge.present?
      addons = charge.booking_addons.reduce([]) do |addons, booking_addon|
        addons.push("#{booking_addon.quantity} x #{booking_addon.addon.name}") if (booking_addon.price.present? && booking_addon.price.positive?)
        addons
      end
      desc = "Booking extras charge for #{addons.join(', ')}"
    end

    if charge.booking_security_deposit?
      desc = "Security Deposit - Booking ##{charge.booking.id}"
    end

    desc
  end
end
