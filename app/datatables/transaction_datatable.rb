class TransactionDatatable
  delegate :params, to: :@view

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
        transaction.member_full_name,
        transaction.booking_id.present? ? transaction.booking_id : '',
        transaction.description,
        transaction.in? ? transaction.amount : '',
        transaction.out? ? transaction.amount : '',
        transaction.try(:charge).try(:user).try(:id)
      ]
    end
  end

  def transactions
    @transactions ||= fetch_transactions
  end

  def fetch_transactions

    if params[:search].present?
      q = params[:search][:value]

      transactions = Transaction.ransack(
        description_cont: q,
        charge_user_full_name_cont: q,
        user_full_name_cont: q,
        booking_id_cont: q,
        id_eq: q,
        m: 'or'
      )
    else
      transactions = Transaction.ransack()
    end

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
