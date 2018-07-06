class Admin::PricingSettingsController < Admin::AdminController
  def index
    respond_to do |format|
      format.html
    end
  end
end
