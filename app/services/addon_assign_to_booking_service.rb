class AddonAssignToBookingService
  def initialize(booking, booking_addons, staff)
    @booking = booking
    @booking_addons = booking_addons
    @staff = staff
  end

  def perform
    user = @booking.user
    if @booking.admin_use? || @booking.lesson_use?
      create_booking_addons_without_charge
      return {success: true}
    end
    charge = Charge.new(
      booking_id: @booking.id,
      charge_type: :e_commerce,
      amount: charge_amount
    )
    @charge_result = ChargeCreateService.new(charge, @staff, user, balance: 0).perform
    create_booking_addons if @charge_result[:success]
    @charge_result
  end

  private

  def create_booking_addons
    @booking_addons.each do |booking_addon|
      booking_addon.assign_attributes(
        price: booking_addon.addon.price,
        charge_id: @charge_result[:charge].id
      )
      @booking.booking_addons << booking_addon
    end
    @booking.save
  end

  def create_booking_addons_without_charge
    @booking_addons.each do |booking_addon|
      booking_addon.assign_attributes(
        price: booking_addon.addon.price
      )
      @booking.booking_addons << booking_addon
    end
    @booking.save
  end

  def charge_amount
    amount = 0
    num_of_date = (@booking.end_date - @booking.start_date).to_i + 1
    @booking_addons.each do |booking_addon|
      addon = booking_addon.addon
      amount += booking_addon.quantity * addon.price if addon.per_booking?
      amount += (booking_addon.quantity * addon.price * num_of_date) if addon.per_date?
    end
    amount
  end
end
