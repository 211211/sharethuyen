class BookingChecklistCategoryDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: BookingChecklistCategory.count,
      recordsFiltered: booking_checklist_categories.total_entries,
      data: data
    }
  end

private

  def data
    booking_checklist_categories.map do |booking_checklist_category|
      [
        booking_checklist_category.id,
        booking_checklist_category.name
      ]
    end
  end

  def booking_checklist_categories
    @booking_checklist_categories ||= fetch_booking_checklist_categories
  end

  def fetch_booking_checklist_categories

    if params[:search].present?
      q = params[:search][:value]
      booking_checklist_categories = BookingChecklistCategory.ransack(name_cont: q)
    else
      booking_checklist_categories = BookingChecklistCategory.ransack()
    end

    booking_checklist_categories.sorts = "#{sort_column} #{sort_direction}"
    booking_checklist_categories.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id name]
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
