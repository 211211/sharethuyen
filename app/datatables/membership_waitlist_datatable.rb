class MembershipWaitlistDatatable < Datatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: MembershipWaitlist.count,
      recordsFiltered: membership_waitlists.total_entries,
      data: data
    }
  end

  private

  def data
    membership_waitlists.map do |item|
      [
        item.id,
        item.user.full_name,
        item.user.email,
        item.membership_type,
        item.user.membership_status,
        item.status,
        item.paid_amount,
        item.id
      ]
    end
  end

  def membership_waitlists
    @membership_waitlists ||= fetch_membership_waitlists
  end

  def fetch_membership_waitlists
    if params[:search].present?
      q = params[:search][:value]

      membership_waitlists = MembershipWaitlist.ransack(
        g: [{
          id_eq: q,
          user_full_name_cont: q,
          user_email_cont: q,
          membership_type_cont: q,
          status_in_text_eq: q,
          m: "or"
        }]
      )
    else
      membership_waitlists = MembershipWaitlist.ransack
    end

    membership_waitlists.sorts = "#{sort_column} #{sort_direction}"
    membership_waitlists.result.page(page).per_page(per_page)
  end

  def sort_column
    columns = %w[id name email status paid_amount]
    if params["order"].present? &&
        params["order"]["0"].present? &&
        params["order"]["0"]["column"].present?
      columns[params[:order]["0"][:column].to_i]
    else
      "id"
    end
  end
end
