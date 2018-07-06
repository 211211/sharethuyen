class TransactionUserDashboardDatatable
  delegate :params, to: :@view
  delegate :current_user, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: Transaction.count,
      recordsFiltered: transactions.total_entries,
      data: data
    }
  end

private

  def data
    transactions.map do |transaction|
      [
        transaction.id,
        transaction.created_at.to_s,
        transaction.booking_id.present? ? transaction.booking_id : '',
        transaction.description,
        transaction.out? ? transaction.amount : '',
        transaction.in? ? transaction.amount : '',
        transaction.balance
      ]
    end
  end

  def transactions
    @transactions ||= fetch_transactions
  end

  def fetch_transactions
    ransack_query = {
      g: [
        booking_user_id_eq: current_user.id,
        charge_user_id_eq: current_user.id,
        user_id_eq: current_user.id,
        m: 'or'
      ]
    }

    if params[:search].present?
      q = params[:search][:value]

      ransack_query[:g] << {
        g: [{
          description_cont: q
        }]
      }
    end
    transactions = Transaction.ransack(ransack_query)

    transactions.sorts = "#{sort_column} #{sort_direction}"
    transactions.result.page(page).per_page(per_page)
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id created_at booking_id amount description in_out]
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
