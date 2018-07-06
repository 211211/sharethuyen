require "fcm"

class FcmSendAdminService
  def initialize(params)
    @title = params[:title]
    @body = params[:body]
  end

  def perform
    fcm = FCM.new(ENV.fetch("fcm_server_key"))
    registration_ids = User.with_role(:admin).where.not(fcm_token: nil).pluck(:fcm_token)

    # notification for display title / body for app in background
    # data for display title / body for app in foreground
    options = {
      notification: { title: @title, body: @body },
      data: { notification: { title: @title, body: @body } } 
    }
    fcm.send(registration_ids, options)
  end
end
