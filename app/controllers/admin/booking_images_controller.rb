class Admin::BookingImagesController < Admin::AdminController
  before_action :get_booking
  before_action :get_booking_image, only: [:destroy]

  def index
    respond_to do |format|
      format.html
      format.json { render json: BookingDatatable.new(view_context) }
    end
  end

  def create
    @booking_image = @booking.booking_images.build(booking_image_params)
    authorize @booking_image

    if @booking_image.save
      render json: @booking_image.to_fileupload.to_json
    else
      render :json => { errors: @booking_image.errors }, :status => :bad_request
    end
  end

  def destroy
    authorize @booking_image
    @booking_image.destroy

    render json: :head
  end

  private
    def get_booking
      @booking = Booking.find(params[:booking_id])
    end

    def booking_image_params
      params.require(:booking_image).permit(:image, :photo_type)
    end

    def get_booking_image
      @booking_image = BookingImage.find(params[:id])
    end
end
