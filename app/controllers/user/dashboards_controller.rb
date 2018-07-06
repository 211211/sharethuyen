class User::DashboardsController < User::UserController
  before_action :authenticate_user!
  def index
    redirect_to admin_dashboard_url if current_user.is_admin?
  end

  def dashboard_confirmed
  end

  def get_current_user
    render :json => current_user
  end

  def booking_datatable
    render json: BookingUserDashboardDatatable.new(view_context)
  end

  def transaction_datatable
    render json: TransactionUserDashboardDatatable.new(view_context)
  end
end
