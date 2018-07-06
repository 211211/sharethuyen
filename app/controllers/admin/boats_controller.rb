class Admin::BoatsController < Admin::AdminController
  before_action :get_boat, only: [:show, :edit, :update, :checklist, :destroy]

  def index

    ransack_query = {
      name_or_description_cont: params[:q]
    }
    if params[:boat_class].present?
      ransack_query[:boat_class_id_eq] = params[:boat_class]
    end
    if params[:status].present?
      if params[:status] == 'refuel'
        refuel_level = BoatRefuelLevelInGallonService.new.perform
        ransack_query[:fuel_remain_lteq] = refuel_level
      else
        ransack_query[:status_eq] = params[:status]
      end
    end

    boats = Boat.includes(
        :boat_images,
        :boat_amenities,
        :booking_checklist_categories
    ).ransack(ransack_query)

    boats.sorts = 'id desc'

    respond_to do |format|
      format.html
      format.json { render json: boats.result, each_serializer: BoatSerializer,
                           adapter: :json, root_key: 'boats', meta: boats_meta(boats.result, params[:boat_class]) }
    end
  end

  def statuses
    statuses = Boat::statuses.map do |k,v|
    {
      key: k,
      name: k.capitalize
    }
    end
    render json: statuses
  end

  def boat_available_for_assigning
    boat_class_id = params[:boat_class_id]
    start_date = params[:start_date]
    end_date = params[:end_date]
    result = BoatAssignableService.new(boat_class_id, start_date, end_date).perform
    boats = result[:boats]
    boats_serialized = ActiveModelSerializers::SerializableResource.new(boats, each_serializer: BoatSerializer)
    result[:boats] = boats_serialized.as_json

    boats_other_classes = result[:boats_other_classes]
    boats_other_classes_serialized = ActiveModelSerializers::SerializableResource.new(boats_other_classes, each_serializer: BoatSerializer)
    result[:boats_other_classes] = boats_other_classes_serialized.as_json
    render json: result
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @boat }
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @boat }
    end
  end

  def new
    @boat = Boat.new

    respond_to do |format|
      format.html
      format.json { render json: @boat }
    end
  end

  def create
    @boat = Boat.new(boat_params)
    authorize @boat

    if @boat.save
      if @boat.yard?
        BoatYardLog.create!(
          boat: @boat,
          start_date: Date.current,
          end_date: @boat.yard_end_date
        )
      end
      render json: @boat
    else
      render :json => { errors: @boat.errors }, :status => :bad_request
    end
  end

  def update
    authorize @boat

    update_result = BoatUpdateService.new(@boat, boat_params).perform
    if update_result == :success
      render json: @boat
    elsif update_result == :boat_yard_update_failure
      render_message_error_growl t(:boat_yard_update_failure)
    else
      render :json => { errors: @boat.errors }, :status => :bad_request
    end
  end

  def checklist
    render json: @boat.booking_checklist_categories, each_serializer: BookingChecklistCategorySerializer
  end

  def booking
  end

  def destroy
    authorize @boat
    @boat.destroy

    render :json => { boat: @boat }
  end

  def booking_calendar
    start_date = Date.parse params[:start_date]
    end_date = Date.parse(params[:end_date]) - 1.day
    boat_class_id = params[:boat_class_id]
    timeline_view = params[:timelineView]
    render json: BoatBookingCalendarService.new(start_date, end_date, boat_class_id, timeline_view).perform
  end

  private

    def boat_params
      params.require(:boat).permit(:name, :description,
        :year, :primary_image_id, :boat_class_id, :status,
        :length, :engine, :engine_hours, :seating, :bathroom, :capacity,
        :identifier, :fuel_consumption, :cruising_speed, :us_coast_guard_capacity,
        :yard_end_date,
        :fuel_meter_enabled, :fuel_rate_of_burn,
        boat_images_attributes: [ :id, :image_url, :is_primary, :_destroy ],
        boat_amenities_boats_attributes: [ :boat_amenity_id ],
        booking_checklist_category_ids: [])
    end

    def get_boat
      @boat = Boat.includes(:boat_images).find(params[:id])
    end

    def boats_meta(boats, boat_class)
      {
          recordsTotal: boats.count,
          boat_classes: ActiveModelSerializers::SerializableResource.new(BoatClass.all).as_json,
          boat_statuses: boat_statuses(boat_class)
      }
    end

    def boat_statuses(boat_class_id)
      where_query = {}
      if boat_class_id.present?
        where_query[:boat_class_id] = boat_class_id
      end

      statuses = [{
                      key: 'total',
                      name: 'All',
                      count: Boat.where(where_query).count
                  }]
      statuses = statuses + Boat::statuses.map do |k,v|
         {
            key: k,
            name: k.capitalize,
            count: Boat.where(where_query).public_send(k).count
        }
      end
      
      refuel_level = BoatRefuelLevelInGallonService.new.perform
      statuses << refuel_status(boat_class_id)
      statuses
    end

    def refuel_status(boat_class_id)
      refuel_level = BoatRefuelLevelInGallonService.new.perform
      if boat_class_id.present?
        count = Boat
                .where('fuel_remain <= ?', refuel_level)
                .where(boat_class_id: boat_class_id).count
      else
        count = Boat.where('fuel_remain <= ?', refuel_level).count
      end
      {
        key: 'refuel',
        name: 'Refuel',
        count: count
      }
    end
end
