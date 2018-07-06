class GroupDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Group.count,
      recordsFiltered: groups.total_entries,
      data: data
    }
  end

private

  def data
    groups.map do |group|
      [
        group.id,
        group.shared? ? 'Shared Group': 'Coporate',
        group.name,
        group.users.count
      ]
    end
  end

  def groups
    @groups ||= fetch_groups
  end

  def fetch_groups

    if params[:search].present?
      q = params[:search][:value]
      groups = Group.ransack(
        users_email_cont: q,
        name_cont: q, m: 'or')
    else
      groups = Group.ransack()
    end

    groups.sorts = "#{sort_column} #{sort_direction}"
    groups.result(distinct: true).page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id membership_type name]
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
