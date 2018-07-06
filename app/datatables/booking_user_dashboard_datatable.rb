class BookingUserDashboardDatatable
  delegate :params, to: :@view
  delegate :current_user, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Booking.not_cancelled.count,
      recordsFiltered: bookings.total_entries,
      data: data
    }
  end

private

  def data
    bookings.map do |booking|
      [
        booking.id,
        booking.status,
        booking.start_date.to_s,
        booking.end_date.to_s,
        (booking.end_date.to_date - booking.start_date.to_date).to_i + 1,
        booking.booking_amount_after_tax,
        booking.boat_class.name
      ]
    end
  end

  def bookings
    @bookings ||= fetch_bookings
  end

  def fetch_bookings
    ransack_query = {
      g: []
    }
    if params[:booking_type].present?
      if params[:booking_type] == 'upcoming_booking'
        ransack_query = {
          g: [{
            start_date_gteq: Date.current,
            user_id_eq: current_user.id
          }]
        }
      else
        ransack_query = {
          g: [{
            start_date_lteq: Date.current,
            user_id_eq: current_user.id
          }]
        }
      end
    end

    if params[:search].present?
      q = params[:search][:value]

      ransack_query[:g] << {
        g: [{
          user_notes_cont: q,
          user_email_cont: q,
          boat_class_name_cont: q,
          m: 'or'
        }]
      }
    end

    bookings = Booking.not_cancelled.ransack(ransack_query)
    bookings.sorts = "#{sort_column} #{sort_direction}"
    bookings.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id start_date end_date boat_class.name ]
    if ((params["order"].present?) &&
        (params["order"]["0"].present?) &&
        (params["order"]["0"]["column"].present?))
      columns[params[:order]['0'][:column].to_i]
    else
      "id"
    end
  end

  def sort_direction
    if ((params["order"].present?) &&
        (params["order"]["0"].present?) &&
        (params["order"]["0"]["dir"].present?))
      params[:order]['0'][:dir] == "desc" ? "desc" : "asc"
    else
      "desc"
    end
  end
end
