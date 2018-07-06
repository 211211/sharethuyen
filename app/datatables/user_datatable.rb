require 'will_paginate/array'
class UserDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: User.count,
      recordsFiltered: users.total_entries,
      data: data
    }
  end

private

  def data
    users.map do |user|
      expire_on = user.membership_valid_until.to_s
      if user.is_unlimited? || user.is_daily?
        expire_on = "~"
      end

      [
        user.id,
        user.email,
        user.full_name,
        user.phone,
        user.membership_type,
        user.group_name,
        user.membership_status.upcase,
        expire_on,
        user.security_deposit_status == :succeeded.to_s ? 'PAID' : 'UNPAID'
      ]
    end
  end

  def users
    @users ||= fetch_users
  end

  def fetch_users

    if params[:search].present?
      q = params[:search][:value]
      users = User
              .includes(:current_membership_charge, :security_deposit_charge, :roles, :group)
              .ransack({
                email_cont: q,
                full_name_cont: q,
                phone_cont: q,
                m: 'or'
              })
    else
      users = User
              .includes(:current_membership_charge, :security_deposit_charge, :roles, :group)
              .ransack()
    end

    case sort_column
    when "membership_type"
      sort_by_func(users, :membership_type)
    when "group_name"
      sort_by_func(users, :group_name)
    when "security_deposit_status"
      sort_by_func(users, :security_deposit_status)
    else
      users.sorts = "#{sort_column} #{sort_direction}"
      users.result.page(page).per_page(per_page)
    end
  end

  def sort_by_func(users, func_name)
    filter_users = users.result.sort_by { |user|
      user.send func_name
    }
    if sort_direction == 'desc'
      filter_users.paginate(:page => page, :per_page => per_page)
    else
      filter_users.reverse.paginate(:page => page, :per_page => per_page)
    end
  end

  def page
    params[:start].to_i/per_page + 1
  end

  def per_page
    params[:length].to_i > 0 ? params[:length].to_i : 10
  end

  def sort_column
    columns = %w[id email first_name phone membership_type group_name membership_status membership_valid_until security_deposit_status]
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
