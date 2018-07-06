class QueryUserBookingNoteService
  def initialize(user_id, page, per_page)
    @user_id = user_id
    @page = page
    @per_page = [per_page.to_i, 20].min
  end

  def perform
    booking_ransack = Booking.ransack(
      user_id_eq: @user_id,
      g: [{
        user_notes_present: 1,
        system_notes_present: 1,
        discount_notes_present: 1,
        charges_note_present: 1,
        m: "or"
      }]
    )

    booking_ransack.sorts = "id desc"
    items = booking_ransack.result(distinct: true)
    .includes(:charges)
    .page(@page).per_page(@per_page).map do |booking|
      {
        id: booking.id,
        user_notes: booking.user_notes,
        system_notes: booking.system_notes,
        discount_notes: booking.discount_notes,
        charges: booking.charges.map do |charge|
          {
            charge_type: charge.charge_type,
            note: charge.note
          }
        end
      }
    end
    {
      records: items,
      recordsTotal: booking_ransack.result.count
    }
  end
end
