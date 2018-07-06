class Admin::BoatAmenitiesController < Admin::AdminController
  before_action :get_boat_amenity, only: [:show, :edit, :update, :destroy]

  def index
    @boat_amenities = BoatAmenity.all.order(created_at: :desc)
    respond_to do |format|
      format.html
      format.json { render json: BoatAmenityDatatable.new(view_context) }
    end
  end

  def search
    #TODO: Should lazy load this function
    @boat_amenities = BoatAmenity.all.order(created_at: :desc)
    respond_to do |format|
      format.json { render json: @boat_amenities }
    end
  end

  def show
    render json: @boat_amenity
  end

  def new
    @boat_amenity = BoatAmenity.new
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @boat_amenity }
    end
  end

  def create
    @boat_amenity = BoatAmenity.new(boat_amenity_params)
    authorize @boat_amenity

    if @boat_amenity.save
      render json: @boat_amenity
    else
      render :json => { errors: @boat_amenity.errors }, :status => :bad_request
    end
  end

  def update
    authorize @boat_amenity

    if @boat_amenity.update(boat_amenity_params)
      render json: @boat_amenity
    else
      render :json => { errors: @boat_amenity.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @boat_amenity
    @boat_amenity.destroy
    render json: @boat_amenity
  end

  private

    def boat_amenity_params
      params.require(:boat_amenity).permit!
    end

    def get_boat_amenity
      @boat_amenity = BoatAmenity.find(params[:id])
    end
end
