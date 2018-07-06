class Admin::BoatClassesController < Admin::AdminController
  before_action :get_boat_class, only: [:show, :edit, :update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json { render json: BoatClassDatatable.new(view_context) }
    end
  end

  def search
    @boat_classes = BoatClass
    .order('order_number')

    respond_to do |format|
      format.json { render json: @boat_classes }
    end
  end

  def show
    respond_to do |format|
      format.html
      render json: @boat_class
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @boat_class }
    end
  end

  def create
    @boat_class = BoatClass.new(boat_class_params)
    authorize @boat_class

    if @boat_class.save
      render json: @boat_class
    else
      render :json => { errors: @boat_class.errors }, :status => :bad_request
    end
  end

  def update
    authorize @boat_class
    if @boat_class.update(boat_class_params)
      render json: @boat_class
    else
      render :json => { errors: @boat_class.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @boat_class
    @boat_class.destroy
    render json: @boat_class
  end

  private

    def boat_class_params
      params.require(:boat_class).permit!
    end

    def get_boat_class
      @boat_class = BoatClass.find(params[:id])
    end
end
