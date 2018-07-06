class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::InvalidForeignKey, :with => :invalid_foreign_key
  rescue_from Stripe::APIConnectionError, :with => :stripe_api_connection
  rescue_from Exception, with: :server_error

  before_action :set_raven_context

  def param_page
    [params[:page].to_i, 1].max
  end

  def render_message_growl(message)
    render json: {
      message: message,
      is_notification: true
    }
  end

  def render_message_error_growl(message)
    render json: {
      message: message,
      is_notification: true,
      type: :error
    }
  end

  private

  def user_not_authorized
    message = "You are not authorized to perform this action."
    respond_to do |format|
      format.html do
        #TODO: Render static component with error message
        self.status = :unauthorized
        render json: { error: message }
      end
      format.json do
        self.status = :unauthorized
        render json: { error: message }
      end
    end
  end

  def invalid_foreign_key(error)
    message = "Can't delete object due to foreign key constraint"
    render json: {
      error: message,
      key: 'InvalidForeignKey'
    }, status: :internal_server_error
  end

  def server_error(error)
    logger.error error.message
    error.backtrace[0..10].each { |line| logger.error line }
    render json: {
      error: error.message,
      key: 'Exception'
    }, status: :internal_server_error
  end

  def stripe_api_connection(error)
    message = "Could not connect to Stripe"
    render json: {
      error: message,
      key: 'Exception'
    }, status: :internal_server_error
  end

  def set_raven_context
    Raven.user_context(id: current_user.id, email: current_user.email) if current_user.present?
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end
end
