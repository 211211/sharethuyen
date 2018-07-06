class BookingAddonValidService
  def initialize(booking, booking_addons)
    @booking = booking
    @booking_addons = booking_addons
  end

  def perform
    result = {
      success: true
    }
    @booking_addons.each do |booking_addon|
      remaining = AddonRemainingService.new(booking_addon.addon, @booking.start_date, @booking.end_date).perform
      quantity = booking_addon.quantity
      if quantity > remaining || quantity <= 0
        result = {
          success: false,
          message: "#{booking_addon.addon.name} only has #{remaining} item(s)"
        }
        break
      end
    end
    result
  end
end
