class Admin::BookingLineItemsController < Admin::AdminController
  before_action :get_booking_line_item, only: [:destroy]

  def upload_image
    line_item = BookingLineItem.where({
      booking_id: booking_line_item_params[:booking_id],
      booking_checklist_line_item_id: booking_line_item_params[:booking_checklist_line_item_id]
    })[0]
    if line_item.present?
      line_item.image = booking_line_item_params[:image]
    else
      line_item = BookingLineItem.new(booking_line_item_params)
    end

    if line_item.save
      render json: line_item.to_fileupload.to_json
    else
      render :json => { errors: line_item.errors }, :status => :bad_request
    end
  end

  def destroy
    @line_item.remove_image!
    @line_item.save

    render json: :head
  end

  private
    def get_booking_line_item
      @line_item = BookingLineItem.find(params[:id])
    end

    def booking_line_item_params
      params.require(:booking_line_item).permit(:image, :booking_id,
        :booking_checklist_line_item_id)
    end

end
