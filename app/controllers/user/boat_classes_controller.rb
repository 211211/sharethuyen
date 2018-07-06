class User::BoatClassesController < User::UserController
  before_action :authenticate_user!

  def search
    @boat_classes = BoatClass
    .where(admin_use: false)
    .order('order_number')

    respond_to do |format|
      format.json { render json: @boat_classes }
    end
  end
end
