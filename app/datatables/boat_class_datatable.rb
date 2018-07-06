class BoatClassDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: BoatClass.count,
      recordsFiltered: boat_classes.total_entries,
      data: data
    }
  end

private

  def data
    boat_classes.map do |boat_class|
      [
        boat_class.id,
        boat_class.name,
        boat_class.color_hex,
        boat_class.order_number
      ]
    end
  end

  def boat_classes
    @boat_classes ||= fetch_boat_classes
  end

  def fetch_boat_classes

    if params[:search].present?
      q = params[:search][:value]
      boat_classes = BoatClass.ransack(name_cont: q)
    else
      boat_classes = BoatClass.ransack()
    end

    boat_classes.sorts = "#{sort_column} #{sort_direction}"
    boat_classes.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w(id name color_hex order_number)
    if (params['order'].present?) &&
        (params['order']['0'].present?) &&
        (params['order']['0']['column'].present?)
      columns[params[:order]['0'][:column].to_i]
    else
      4
    end
  end

  def sort_direction
    if (params['order'].present?) &&
        (params['order']['0'].present?) &&
        (params['order']['0']['dir'].present?)
      params[:order]['0'][:dir] == 'desc' ? 'desc' : 'asc'
    else
      'desc'
    end
  end
end
