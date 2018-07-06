require "fcm"

class FcmSendUserService
  def initialize(params)
    @user = params[:user]
    @title = params[:title]
    @body = params[:body]
    @data = params[:data]
  end

  def perform
    fcm = FCM.new(ENV.fetch("fcm_server_key"))
    options = { notification: { title: @title, body: @body }, data: @data }
    fcm.send([@user.fcm_token], options)
  end
end
