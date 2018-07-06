class Admin::ChargesController < Admin::AdminController
  before_action :get_charge, only: [:show, :update_payment_method, :pay_now, :update_amount, :destroy,
                                    :update_discount_percent, :request_deposit_return]

  def index
    render json: Charge.where({ booking_id: params[:booking_id] })
  end

  def show
    render json: @charge
  end

  def create
    charge = Charge.new(charge_params)
    result = ChargeService.new(charge, current_user, params[:fuel], params[:meta]).perform
    if result[:success]
      render json: result[:charge]
    elsif result[:error_code] == :cannot_save_fuel_log
      render_message_error_growl t(:cannot_create_fuel_log_for_charge)
    elsif result[:error_code] == :fuel_params_missing
      render_message_error_growl t(:fuel_param_is_missing)
    elsif result[:error_code] == :created_charge_fail
      render_message_error_growl result[:message]
    else
      render :json => { errors: result[:charge].errors }, :status => :bad_request
    end
  end

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
      render json: @charge
    else
      render_message_error_growl pay_result[:message]
    end
  end

  def update_amount
    @charge.update_attribute(:amount, params[:value])
    render_message_growl t(:update_charge_amount_successfully)
  end

  def update_discount_percent
    discount_percent = params[:value].to_f

    if params[:type] == 'amount'
      discount_amount = params[:value].to_f
      discount_percent = discount_amount * 100 / @charge.amount
    end

    @charge.update_attribute(:discount_percent, discount_percent)
    render_message_growl t(:update_charge_discount_percent_successfully)
  end

  def destroy
    authorize @charge
    @charge.destroy

    render :json => { charge: @charge }
  end

  def request_deposit_return
    unless @charge.security_deposit?
      render_message_error_growl 'You can request deposit charge return only!' and return
    end

    if @charge.update_column(:requested_return, true)
      ChargeMailer.request_deposit_return_admin_email(@charge.user.id).deliver_later

      charge_serialized = ActiveModelSerializers::SerializableResource.new(@charge)
      render json: { charge: charge_serialized.as_json }
    else
      render_message_error_growl 'Something went wrong, please try again later!'
    end
  end

  private
    def charge_params
      params.require(:charge).permit(
        :booking_id, :charge_type, :note, :amount)
    end

    def payment_method_params
      params.require(:charge).permit(
        :stripe_source_id, :source)
    end

    def get_charge
      @charge = Charge.find params[:id]
    end
end
