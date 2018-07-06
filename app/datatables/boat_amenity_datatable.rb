class BoatAmenityDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: BoatAmenity.count,
      recordsFiltered: boat_amenities.total_entries,
      data: data
    }
  end

private

  def data
    boat_amenities.map do |boat_amenity|
      [
        boat_amenity.id,
        boat_amenity.name,
        boat_amenity.icon.thumb.url
      ]
    end
  end

  def boat_amenities
    @boat_amenities ||= fetch_boat_amenities
  end

  def fetch_boat_amenities

    if params[:search].present?
      q = params[:search][:value]
      boat_amenities = BoatAmenity.ransack(name_cont: q)
    else
      boat_amenities = BoatAmenity.ransack()
    end

    boat_amenities.sorts = "#{sort_column} #{sort_direction}"
    boat_amenities.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id name icon]
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
