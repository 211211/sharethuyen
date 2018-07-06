class BookingDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Booking.count,
      recordsFiltered: bookings.total_entries,
      data: data
    }
  end

private

  def data
    bookings.map do |booking|
      if @red_flag_enabled
        [
          booking.id,
          booking.no_show ? "NO SHOW" : booking.status.humanize.upcase,
          booking.user.full_name,
          booking.user.email,
          booking.red_flags,
          booking.start_date.to_s,
          booking.end_date.to_s,
          booking.user.id
        ]
      else
        [
          booking.id,
          booking.booking_type,
          booking.no_show ? "NO SHOW" : booking.status.humanize.upcase,
          booking.user.full_name,
          booking.user.email,
          booking.boat.present? ? booking.boat.name : '',
          booking.boat_class.name,
          booking.start_date.to_s,
          booking.end_date.to_s,
          booking.user.id
        ]
      end
    end
  end

  def bookings
    @bookings ||= fetch_bookings
  end

  def fetch_bookings

    # TODO: This is quick & dirty way to filter
    # Need an universal solution applied
    boat_id = params["columns"]["4"]["search"]["value"]
    user_id = params["columns"]["5"]["search"]["value"]
    statuses = params["columns"]["3"]["search"]["value"]

    status_query = {
      status_in_text_in: statuses,
      m: 'or'
    }
    # TODO: Do not need to do it complex like this
    # Suggest to make no_show as a status of booking
    # Waiting for confirmation
    if statuses.present? && (statuses.include? 'no_show')
      status_query[:no_show_eq] = true
      statuses.delete('no_show')
    end
    if params[:search].present?
      q = params[:search][:value]
      @red_flag_enabled = params["redFlagEnabled"]

      bookings = Booking.ransack(
        g: [{
          id_eq: q,
          user_notes_cont: q,
          user_full_name_cont: q,
          user_email_cont: q,
          boat_class_name_cont: q,
          boat_name_cont: q,
          m: "or"
        }, status_query],
        red_flags_null: @red_flag_enabled ? "0" : "",
        boat_id_eq: boat_id.presence || "",
        user_id_eq: user_id.presence || ""
      )
    else
      bookings = Booking.ransack(
        g: status_query,
        red_flags_null: @red_flag_enabled ? "0" : "",
        boat_id_eq: boat_id.presence || "",
        user_id_eq: user_id.presence || ""
      )
    end

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
    if @red_flag_enabled
      columns = %w[id status user.full_name user.email red_flags start_date end_date]
    else
      columns = %w[id booking_type status user.email boat.name, boat_class.name start_date end_date]
    end

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
