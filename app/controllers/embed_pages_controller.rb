class EmbedPagesController < ApplicationController
  layout "no_layout"

  before_action :allow_embed_anywhere

  def inventory
    @boats = Boat.joins(:boat_class)
                 .includes(:boat_images)
                 .where("boat_classes.admin_use = ?", false)
                 .order(:name)
  end

  def boats
    @boats = Boat.joins(:boat_class)
                 .includes(:boat_images)
                 .where("boat_classes.admin_use = ?", false)
                 .all
    @boat_classes = BoatClass.where(admin_use: false)
                             .order("order_number")
  end

  def show_boat
    @boat = Boat.includes(:boat_class, :boat_amenities, :boat_images)
                .find params[:id]
  end

  private

  def allow_embed_anywhere
    response.headers.delete "X-Frame-Options"
  end
end
