class Admin::AddonsController < Admin::AdminController
  before_action :get_addon, only: [:edit, :show, :update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json { render json: AddonDatatable.new(view_context) }
    end
  end

  def addon_available_for_adding
    addons = Addon.all
    addons.each do |addon|
      addon.remaining = AddonRemainingService.new(addon, params[:start_date], params[:end_date]).perform
    end
    render json: addons
  end

  def create
    @addon = Addon.new(addon_params)
    if @addon.save
      render json: @addon
    else
      render json: { errors: @addon.errors }, status: :bad_request
    end
  end

  def show
    render json: @addon
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @addon }
    end
  end

  def update
    if @addon.update(addon_params)
      render json: {
        addon: @addon
      }
    else
      render json: { errors: @addon.errors }, status: :bad_request
    end
  end

  def destroy
    @addon.destroy
    render json: { addon: @addon }
  end

  private

  def addon_params
    params.require(:addon).permit(:name, :price, :quantity, :price_strategy)
  end

  def get_addon
    @addon = Addon.find(params[:id])
  end
end
