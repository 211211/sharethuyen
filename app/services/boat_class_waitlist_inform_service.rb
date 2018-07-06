class BoatClassWaitlistInformService
  def initialize(booking)
    @booking = booking
  end

  def perform
    waitlists = BoatClassWaitlist.ransack(
      boat_class_id_eq: @booking.boat_class_id,
      date_in: @booking.start_date..@booking.end_date
    ).result
    return unless waitlists.count.positive?
    reserve_time_for_waitlist = Setting.reserve_time_for_waitlist
    reserve_until = Time.zone.now + reserve_time_for_waitlist * 60
    waitlists.update_all(reserve_until: reserve_until)
    waitlists.each { |waitlist| BoatClassAvaiWaitlistMailer.inform_email(waitlist).deliver_later }
  end
end
