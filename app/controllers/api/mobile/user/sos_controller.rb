class Api::Mobile::User::SosController < Api::Mobile::User::UserController
  def create
    sos = Sos.new(sos_params)
    sos.user = current_user
    body = sos.sos_type.humanize
    body += " - #{sos.message}" if sos.message.present?
    FcmSendAdminService.new(
      title: "#{Setting.site_name} - SOS submitted",
      body:  body
    ).perform
    MessageCreateService.new(
      current_user, :sos_message, body
    ).perform
    if sos.save
      FirebaseAdminService.new.sync_num_of_sos
      render json: sos
    else
      render json: {errors: sos.errors}, status: :bad_request
    end
  end

  private

  def sos_params
    params.require(:sos).permit(:booking_id, :sos_type, :message)
  end
end
