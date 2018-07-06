class Api::Mobile::Admin::ServiceRequestController < Api::Mobile::Admin::AdminController
  before_action :get_service_request, only: [:answer, :resolve]
  def index
    offset = params[:page].to_i * num_item_per_page
    service_request = ServiceRequest.where(resolved: false)
    service_request = service_request.where("service_request_type IN (?)", params[:types].split(",")) if params[:types]
    service_request = service_request.order("id DESC").limit(num_item_per_page).offset(offset)
    render json: service_request
  end

  def answer
    answer = ServiceRequestResponse.new(
      service_request_id: @service_request.id,
      message:            params[:message],
      user:               current_user
    )

    FcmSendUserService.new(
      user:  @service_request.user,
      title: "#{Setting.site_name} - Service request response",
      body:  params[:message]
    ).perform

    if answer.save
      @service_request.update_attributes(resolved: true)
      render json: answer
    else
      render json: {errors: answer.errors}, status: :bad_request
    end
  end

  def resolve
    @service_request.resolved = true
    if @service_request.save
      FirebaseAdminService.new.sync_num_of_service_request
      render json: {message: "Resolve succesfully!"}
    else
      render json: {errors: @service_request.errors}, status: :bad_request
    end
  end

  private

  def get_service_request
    @service_request = ServiceRequest.find(params[:id])
  end
end
