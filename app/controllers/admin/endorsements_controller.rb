class Admin::EndorsementsController < Admin::AdminController

  def index

    respond_to do |format|
      format.html
      format.json { render json: {} }
    end
  end
end
