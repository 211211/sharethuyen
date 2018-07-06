class Admin::SeasonsController < Admin::AdminController

  def index
    respond_to do |format|
      format.html
    end
  end

  def deposit_return_users
    render json: DepositReturnUserDatatable.new(view_context)
  end
end
