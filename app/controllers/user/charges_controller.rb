class User::ChargesController < User::UserController
  before_action :authenticate_user!
  before_action :get_charge, only: [:update_payment_method, :pay_now, :request_deposit_return]

  def update_payment_method
    result = @charge.update_payment_method(payment_method_params)
    if result[:key] == :success
      render json: {
        message: t(:card_payment_update_successfully),
        is_notification: true,
        type: result[:type]
      }
    else
      render :json => { error: result[:message] }, :status => :bad_request
    end
  end

  def pay_now
    pay_result = PaymentService.new(@charge, @charge.user, current_user).perform

    if pay_result[:key] == :success
      charge_serialized = ActiveModelSerializers::SerializableResource.new(@charge)
      user_serialized = ActiveModelSerializers::SerializableResource.new(@charge.user)
      render json: { charge: charge_serialized.as_json, user: user_serialized.as_json }
    else
      render_message_error_growl pay_result[:message]
    end
  end

  def request_deposit_return
    unless @charge.security_deposit?
      render_message_error_growl 'You can request deposit charge return only!' and return
    end

    if @charge.update_column(:requested_return, true)
      ChargeMailer.request_deposit_return_admin_email(@charge.user.id).deliver_later

      user_serialized = ActiveModelSerializers::SerializableResource.new(@charge.user)
      render json: { user: user_serialized.as_json }
    else
      render_message_error_growl 'Something went wrong, please try again later!'
    end
  end

  private

    def payment_method_params
      params.require(:charge).permit(
        :stripe_source_id, :source)
    end

    def get_charge
      @charge = Charge.find params[:id]
      user_id = current_user.id

      if @charge.user_id != user_id && @charge.booking.user_id != user_id
        # This charge is not belonged to logged-in user
        user_not_authorized
      end
    end
end
