class BoatClassWaitlistDatatable < Datatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: BoatClassWaitlist.ransack(date_gteq: Date.current).result.count,
      recordsFiltered: boat_class_waitlists.total_entries,
      data: data
    }
  end

  private

  def data
    boat_class_waitlists.map do |item|
      num_of_not_yard_status_boat = item.boat_class.boats.not_in_yard.count
      available_data = CheckClassAvailabilityByDateService.new(
        boat_class: item.boat_class,
        date: item.date,
        num_of_not_yard_status_boat: num_of_not_yard_status_boat
      ).perform
      available_data[:user_id] = item.user.id
      available_data[:boat_class_id] = item.boat_class.id
      available_data[:date] = item.date.to_s(:full_calendar)
      [
        item.id,
        item.user.full_name,
        item.user.email,
        item.boat_class.name,
        item.date.to_s,
        available_data
      ]
    end
  end

  def boat_class_waitlists
    @boat_class_waitlists ||= fetch_membership_waitlists
  end

  def fetch_membership_waitlists
    if params[:search].present?
      q = params[:search][:value]

      boat_class_waitlists = BoatClassWaitlist.ransack(
        g: [{
          user_full_name_cont: q,
          user_email_cont: q,
          boat_class_name_cont: q,
          date_gteq: Date.current,
          m: "or"
        }]
      )
    else
      boat_class_waitlists = BoatClassWaitlist.ransack(
        date_gteq: Date.current
      )
    end

    boat_class_waitlists.sorts = "#{sort_column} #{sort_direction}"
    boat_class_waitlists.result.page(page).per_page(per_page)
  end

  def sort_column
    columns = %w[id name email boat_class date]
    if params["order"].present? &&
        params["order"]["0"].present? &&
        params["order"]["0"]["column"].present?
      columns[params[:order]["0"][:column].to_i]
    else
      "id"
    end
  end
end
