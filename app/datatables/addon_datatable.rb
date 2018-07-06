class AddonDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Addon.count,
      recordsFiltered: addons.total_entries,
      data: data
    }
  end

private

  def data
    addons.map do |addon|
      [
        addon.id,
        addon.name,
        addon.price,
        addon.quantity
      ]
    end
  end

  def addons
    @addons ||= fetch_addons
  end

  def fetch_addons

    if params[:search].present?
      q = params[:search][:value]
      addons = Addon.ransack(
        name_cont: q)
    else
      addons = Addon.ransack()
    end

    addons.sorts = "#{sort_column} #{sort_direction}"
    addons.result(distinct: true).page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id name price quantity]
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
