class Admin::EmailTemplatesController < Admin::AdminController
  def index
    respond_to do |format|
      format.html
    end
  end
end
