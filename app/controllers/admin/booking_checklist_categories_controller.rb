class Admin::BookingChecklistCategoriesController < Admin::AdminController
  before_action :get_booking_checklist_category, only: [:show, :edit, :update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json { render json: BookingChecklistCategoryDatatable.new(view_context) }
    end
  end

  def search
    #TODO: Should lazy load this function
    @booking_checklist_categories = BookingChecklistCategory.all.order(created_at: :desc)
    respond_to do |format|
      format.json { render json: @booking_checklist_categories }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @booking_checklist_category }
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @booking_checklist_category }
    end
  end

  def create
    @booking_checklist_category = BookingChecklistCategory.new(booking_checklist_category_params)
    authorize @booking_checklist_category

    if @booking_checklist_category.save
      render json: @booking_checklist_category
    else
      render :json => { errors: @booking_checklist_category.errors }, :status => :bad_request
    end
  end

  def update
    authorize @booking_checklist_category
    if @booking_checklist_category.update(booking_checklist_category_params)
      render json: @booking_checklist_category
    else
      render :json => { errors: @booking_checklist_category.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @booking_checklist_category
    @booking_checklist_category.destroy
    render json: @booking_checklist_category
  end

  private

    def booking_checklist_category_params
      params.require(:booking_checklist_category).permit(:name,
        line_items_attributes: [ :id, :name, :image, :_destroy ])
    end

    def get_booking_checklist_category
      @booking_checklist_category = BookingChecklistCategory.find(params[:id])
    end
end
