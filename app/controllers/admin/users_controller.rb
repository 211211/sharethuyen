class Admin::UsersController < Admin::AdminController
  before_action :get_user, only: [:show, :edit, :update, :update_password,
    :red_flag, :endorsement, :update_membership,
    :update_endorsement, :destroy, :return_deposit]

  def index
    respond_to do |format|
      format.html
      format.json { render json: UserDatatable.new(view_context) }
    end
  end

  def search
    q = params[:q]
    user_ransack = User.ransack({
      roles_name_not_eq: 'admin',
      roles_resource_type_null: '1',
      g: [{
        full_name_cont: q,
        email_cont: q,
        m: 'or'
      }]
    })
    user_ransack.sorts = 'id desc'

    # Need include billing_addresses so that when select this member, 
    # we can perform other action, ex. adding card and link billing address to that card
    users = user_ransack.result
    .includes(
      :billing_addresses,
      :boat_classes, :membership_charges,
      :security_deposit_charge, :user_profile, :current_membership_charge, :roles,
      group: [users: [:current_membership_charge]])
    .paginate(page: 1, per_page: 10)

    render json: users, each_serializer: UserBookingSerializer
  end

  def search_not_belong_group
    q = params[:q]
    user_ransack = User
    .ransack({
      roles_name_in: ['user_single', 'mid_week', 'unlimited'],
      roles_resource_type_null: 1,
      # charges_charge_type_eq: Charge.charge_types[:membership],
      # charges_status_not_eq: Charge.statuses[:succeeded],
      g: [{
        full_name_cont: q,
        email_cont: q,
        m: 'or'
      }]
    })
    user_ransack.sorts = 'id desc'

    # Use where & where.not here since the follow code is not equivalent for ransack
    # charges_charge_type_eq: Charge.charge_types[:membership],
    # charges_status_not_eq: Charge.statuses[:succeeded],
    users = user_ransack.result
    .includes(
      :billing_addresses,
      :boat_classes, :user_profile, :membership_charges, :current_membership_charge,
      :security_deposit_charge, :roles, group: [users: [:current_membership_charge]])
    .where(charges: {charge_type: Charge.charge_types[:membership]})
    .where.not(charges: { status: Charge.statuses[:succeeded]})
    .paginate(page: 1, per_page: 10)

    users_in_group = User.ransack({
      group_id_present: 1,
      g: [{
        full_name_cont: q,
        email_cont: q,
        m: 'or'
      }]
    }).result
    .paginate(page: 1, per_page: 10)

    users = (users + users_in_group).uniq
    render json: users
  end

  def show
    render json: User.includes(
      :boat_classes, :membership_charges,
      :security_deposit_charge, :user_profile, :current_membership_charge, :roles,
      group: [users: [:current_membership_charge]]
    ).find_by(id: params[:id])
  end

  def new
    @user = User.new
    respond_to do |format|
      format.html
      format.json { render json: @user }
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json { render json: @user }
    end
  end

  def create
    @user = User.new(user_params)
    authorize @user
    create_user_result = @user.create_user
    if create_user_result[:status] == :success
      render json: @user
    else
      if @user.errors.count > 0
        render :json => { errors: @user.errors }, :status => :bad_request
      else
        render :json => { error: create_user_result[:message] }, :status => :bad_request
      end
    end
  end

  def update
    authorize @user

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

  def endorsement
    respond_to do |format|
      format.html
      format.json { render json: @user, serializer: UserEndorsementSerializer }
    end
  end

  def update_endorsement
    if UserUpdateEndorsementService.new(@user, user_endorsement_params, params[:meta]).perform
      render_message_growl t(:update_endorsement_successfully)
    else
      render_message_error_growl t(:cannot_update_endorsement)
    end
  end

  def red_flag
    render :json => @user.red_flag
  end

  def update_membership
    update_membership_result = @user.update_membership(params[:membership_type], true)

    if update_membership_result[:key] == :success
      user_serialized = ActiveModelSerializers::SerializableResource.new(@user)
      render json: user_serialized.as_json
    else
      render_message_error_growl update_membership_result[:message]
    end
  end

  def destroy
    authorize @user
    @user.destroy

    render json: @user
  end

  def export
    respond_to do |format|
      format.html { redirect_to root_url }
      format.csv { send_data User.to_csv, filename: 'members.csv' }
    end
  end

  def return_deposit
    method = params[:method]

    if method.to_i == 5
      @user.security_deposit_charge.update_columns(requested_return: false)
      render_message_growl 'Done' and return
    end

    if @user.return_deposit(current_user, method.to_i)
      ChargeMailer.returned_deposit_charge_email(@user.id, @user.security_deposit_charge.id, method.to_i).deliver_later

      render_message_growl 'Transaction has been created successfully'
    else
      render_message_error_growl 'Something went wrong, please try again later'
    end
  end

  def start_renewal_membership_charge
    user = User.find params[:id]

    CreateRenewalMembershipChargeService.new(user).perform

    user_serialized = ActiveModelSerializers::SerializableResource.new(user.reload)

    render json: {
        status: :ok,
        redirect: edit_admin_user_path(user),
        user: user_serialized.as_json
    }
  end

  def bookings; end

  def notes; end

  def booking_notes
    id = params[:id]
    page = params[:page]
    per_page = params[:per_page]
    render json: QueryUserBookingNoteService.new(id, page, per_page).perform
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation,
        :first_name, :last_name,
        :phone, :secondary_phone, :address,
        :profile_picture, :is_active, :balance,
        billing_addresses_attributes:
          [ :id, :line1, :line2, :city, :state, :zip, :country, :_destroy],
        role_ids: [])
    end

    def user_update_params
      params.require(:user).permit(:email, :first_name, :last_name,
        :phone, :secondary_phone, :address,
        :profile_picture, :is_active, :balance,
        billing_addresses_attributes:
          [ :id, :line1, :line2, :city, :state, :zip, :country, :_destroy],
        role_ids: [])
    end

    def user_endorsement_params
      params.require(:user).permit(
        :endorsement,
        boat_class_ids: [],
        user_profile_attributes: [ :id,
          :wa_state_marine_photo, :wa_state_marine_field,
          :driver_license_photo, :driver_license_field ])
    end

    def user_password_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    def get_user
      @user = User.find(params[:id])
    end
end
