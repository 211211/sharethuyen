class Admin::TransactionsController < Admin::AdminController

  def index
    respond_to do |format|
      format.html
      format.json { render json: TransactionDatatable.new(view_context) }
    end
  end

  def export
    start_date = params[:start_date]
    end_date = params[:end_date]
    query = {}
    if start_date.present? && end_date.present?
      query = {
          created_at_gteq: start_date.in_time_zone,
          created_at_lteq: "#{end_date} 23:59".in_time_zone,
      }
    end

    search = Transaction.includes(:staff, :charge).ransack(query)
    search.sorts = 'id desc'
    @transaction = search.result

    file_name_append = (start_date.present? && end_date.present?) ? "#{start_date}-#{end_date}" : 'all'

    respond_to do |format|
      format.html { redirect_to root_url }
      format.csv { send_data Transaction.to_csv(@transaction), filename: "transactions-#{file_name_append}.csv" }
    end
  end
end
