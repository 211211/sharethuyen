class Admin::BoatClassPricesController < Admin::AdminController
  def index
    respond_to do |format|
      format.html
      format.json { render json: BuildBoatClassPricing.new.perform }
    end
  end

  def update
    boat_class_price = BoatClassPrice.find params[:id]
    if boat_class_price.update_attributes(price: params[:price])
      render json: :head
    else
      render json: { error: boat_class_price.errors.full_messages }, status: :bad_request
    end
  end
end
