class AddonRemainingService
  def initialize(addon, start_date, end_date)
    @addon = addon
    @start_date = start_date
    @end_date = end_date
  end

  def perform
    used_quantity = BookingAddon
                    .includes(:booking)
                    .where(
                      "((bookings.start_date <= ? AND bookings.end_date >= ?) OR (bookings.start_date <= ? AND bookings.end_date >= ?)) AND addon_id = ? AND bookings.status NOT IN (?)",
                      @start_date,
                      @start_date,
                      @end_date,
                      @end_date,
                      @addon.id,
                      [Booking.statuses[:completed], Booking.statuses[:cancelled]]
                    )
                    .references(:booking)
                    .sum(:quantity)
    @addon.quantity - used_quantity
  end
end
