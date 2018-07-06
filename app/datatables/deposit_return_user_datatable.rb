require 'will_paginate/array'
class DepositReturnUserDatatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
        echo: params[:sEcho].to_i,
        recordsTotal: User.ransack(
            security_deposit_charge_requested_return_eq: true
        ).result.count,
        recordsFiltered: users.total_entries,
        data: data
    }
  end

  private

  def data
    users.map do |user|
      [
          user.id,
          user.full_name,
          user.email,
          user.phone,
          user.security_deposit_charge.amount,
          user.is_paid_membership_charges
      ]
    end
  end

  def users
    @users ||= fetch_users
  end

  def fetch_users

    if params[:search].present?
      q = params[:search][:value]
      users = User.includes(:security_deposit_charge, :current_membership_charge).ransack(
          email_or_full_name_cont: q,
          security_deposit_charge_requested_return_eq: true
      )
    else
      users = User.includes(:security_deposit_charge, :current_membership_charge).ransack(
          security_deposit_charge_requested_return_eq: true
      )
    end

    users.sorts = "#{sort_column} #{sort_direction}"
    users.result.page(page).per_page(per_page)
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
    columns = %w[id email first_name phone]
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
