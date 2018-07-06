class Api::Mobile::User::ServiceRequestController < Api::Mobile::User::UserController
  def create
    service_request = ServiceRequest.new(service_request_params)
    service_request.user = current_user
    body = service_request.service_request_type.humanize
    body += " - #{service_request.message}" if service_request.message.present?
    FcmSendAdminService.new(
      title: "#{Setting.site_name} - Service request submitted",
      body:  body
    ).perform
    MessageCreateService.new(
      current_user, :service_message,
      body
    ).perform
    if service_request.save
      FirebaseAdminService.new.sync_num_of_service_request
      render json: service_request
    else
      render json: {errors: service_request.errors}, status: :bad_request
    end
  end

  private

  def service_request_params
    params.require(:service_request).permit(:booking_id, :service_request_type, :message)
  end
end
