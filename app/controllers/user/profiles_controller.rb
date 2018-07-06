class User::ProfilesController < User::UserController
  before_action :authenticate_user!
  before_action :get_user, only: [:update, :update_password,
                                  :update_membership, :red_flag, :weekend_bookings,
                                  :start_renewal_membership_charge]

  def index
  end

  def endorsement
    render json: current_user, serializer: UserEndorsementSerializer
  end

  def update
    if @user.update(user_update_params)
      render json: @user
    else
      render :json => { errors: @user.errors }, :status => :bad_request
    end
  end

  def update_password
    if @user.update(user_password_params)
      render_message_growl t(:password_update_successfully)
    else
      render :json => { errors: @user.errors }, :status => :bad_request
    end
  end

  def update_membership
    update_membership_result = @user.update_membership(params[:membership_type])

    if update_membership_result[:key] == :success
      user_serialized = ActiveModelSerializers::SerializableResource.new(current_user.reload)
      render json: user_serialized.as_json
    else
      render_message_error_growl update_membership_result[:message]
    end
  end

  def red_flag
    render :json => @user.red_flag
  end

  def weekend_bookings
    max_weekend_bookings = 2
    if @user.group&.shared?
      max_weekend_bookings = BookingService.max_weekend_holiday_for_group(@user.group)
    end
    weekend_bookings, weekend_bookings_count = BookingService.weekend_bookings_of_user(@user)
    weekend_bookings_serialized = ActiveModelSerializers::SerializableResource.new(weekend_bookings)
    render :json => {
        weekend_bookings: weekend_bookings_serialized,
        weekend_bookings_count: weekend_bookings_count,
        max_weekend_bookings: max_weekend_bookings
    }
  end

  def start_renewal_membership_charge
    CreateRenewalMembershipChargeService.new(@user).perform

    user_serialized = ActiveModelSerializers::SerializableResource.new(current_user.reload)

    render json: {
        status: :ok,
        redirect: profile_path(active_tab: :billing),
        user: user_serialized.as_json
    }
  end
  
  def send_confirmation_mail
    current_user.send_confirmation_instructions
    render_message_growl t(:sent_confirmation_instructions)
  end

  def pay_to_wait_list
    stripe_token = params[:stripe_token]
    is_store_card = params[:is_store_card]
    membership_type = params[:membership_type]
    service_result = PaymentToWaitListService.new(current_user, stripe_token, is_store_card, membership_type).perform
    if service_result[:result] == :success
      render json: {
        membership_waitlist: service_result[:membership_waitlist],
        sources: service_result[:sources]
      }
    else
      render_message_error_growl t(service_result[:result])
    end
  end

  private

  def get_user
    @user = User.find current_user.id
  end

  def user_update_params
    params.require(:user).permit(:first_name, :last_name,
      :phone, :secondary_phone, :address,
      :profile_picture,
      billing_addresses_attributes:
        [ :id, :line1, :line2, :city, :state, :zip, :country, :_destroy])
  end

  def user_password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

end
