class Admin::BookingsController < Admin::AdminController
  before_action :get_booking, only: [:show, :destroy, :pay_now, :update,
    :assign_boat, :cancel, :start_booking, :complete_booking, :process_check_in_boat,
    :calculate_refund_amount, :check_in_boat, :update_notes, :view_images]

  def index
    respond_to do |format|
      format.html
      format.json { render json: BookingDatatable.new(view_context) }
    end
  end

  def new; end

  def show
    if params[:step] == 'check_in_boat'
      @booking.start_process_check_in
    end

    respond_to do |format|
      format.html
      format.json { render :json => @booking,
        include: [
          'user.billing_addresses',
          'transactions',
          'boat.primary_image',
          'charges',
          'booking_images',
          'booking_line_items',
          'booking_addons.addon'
        ] }
    end
  end

  def edit; end

  def create
    @user = User.find(booking_params[:user_id])
    @booking = @user.bookings.build(booking_params)
    authorize @booking

    valid_booking_check = BookingValidService.new(@booking).perform
    unless valid_booking_check[:result] == :success

      # The error message can return from validation service
      # Otherwise, get message from language file
      error = valid_booking_check[:message].presence || t(valid_booking_check[:result])
      render json: {
        error: error
      }, status: :bad_request and return
    end

    if @booking.admin_use? || @booking.lesson_use?
      BookingAdminAndLessonCreateService.new(@booking, current_user).perform
    else
      BookingPaymentAndSaveService.new(@booking, current_user).perform
    end

    render json: @booking
  end

  def update
    authorize @booking
    @booking.assign_attributes(update_booking_params)
    valid_booking_check = BookingValidService.new(@booking).perform
    unless valid_booking_check[:result] == :success

      # The error message can return from validation service
      # Otherwise, get message from language file
      error = valid_booking_check[:message].presence || t(valid_booking_check[:result])
      valid_booking_check[:message].presence || t(valid_booking_check[:result])
      render json: {
        error: error
      }, status: :bad_request and return
    end

    BookingPaymentAndSaveService.new(@booking, current_user).perform

    render json: @booking
  end

  def destroy
    authorize @booking
    @booking.destroy

    render :json => { booking: @booking }
  end

  def pay_now
    if params[:user_notes].present?
      @booking.user_notes = params[:user_notes]
    end
    if @booking.save
      results = @booking.pay_now(current_user)
      booking_serialized = ActiveModelSerializers::SerializableResource.new(@booking)

      render json: { results: results, booking: booking_serialized }
    else
      render :json => { errors: @booking.errors }, :status => :bad_request
    end
  end

  def cancel
    if @booking.admin_use? || @booking.lesson_use?
      BookingAdminAndLessonCancelService.new(@booking).perform
      render json: { message: t(:booking_cancel_successfully) }
    else
      cancellation_time = Time.zone.now
      cancel_booking_result = BookingCancelService.new(@booking, current_user, cancellation_time).perform
      if cancel_booking_result[:key] == :success
        render json: { message: t(:booking_cancel_successfully) }
      else
        render :json => { error: cancel_booking_result[:message] }, :status => :bad_request
      end
    end
  end

  def assign_boat
    boat_id = params[:boat_id]
    override_confirmed = params[:override_confirmed]
    assign_result = BoatAssignService.new(@booking, boat_id, override_confirmed, Time.zone.now).perform
    if assign_result[:result] == :success
      render json: assign_result[:booking]
    else
      render json: { errors: assign_result[:errors] }, status: :bad_request
    end
  end

  def start; end

  def complete; end

  def view_images; end

  def check_in_boat
    unless @booking.in_use?
      redirect_to admin_booking_path(@booking) and return
    end
  end

  def start_booking
    authorize @booking
    if @booking.start_date != Date.current && Rails.env == 'production'
      render_message_error_growl t(:cannot_start_booking_not_today)
    elsif @booking.boat.blank?
      render_message_error_growl 'Need assign boat before Start Booking'
    elsif !@booking.boat.dock?
      render_message_error_growl 'You can start a booking with boat that is IN DOCK only, please check again please!'
    elsif !@booking.user.has_at_least_one_chargeable_payment
      render_message_error_growl 'This user does not have any payment method that might be chargeable. Please ask he/she to add new payment method, or verify added bank accounts.'
    else
      CreateBookingSecurityDepositCharges.new(current_user, @booking, security_deposit_params).perform
      BookingStartService.new(@booking).perform
      render_message_growl t(:booking_start_successfully)
    end
  end

  def process_check_in_boat
    need_attention = BookingService.update_line_items booking_complete_params[:booking_line_items_attributes]
    @booking.check_in_boat(booking_complete_params[:complete_notes], need_attention)
    render_message_growl t(:booking_check_in_boat_successfully)
  end

  def complete_booking
    need_attention = BookingService.update_line_items booking_complete_params[:booking_line_items_attributes]
    @booking.complete_booking(current_user, need_attention, params[:request_a_review])
    render_message_growl t(:booking_complete_successfully)
  end

  def booking_not_assign
    start_date = Date.parse params[:start_date]
    end_date = Date.parse params[:end_date]
    boat_class_id = params[:boat_class_id]
    timeline_view = params[:timelineView]
    render json: Booking.to_be_assigned(start_date, end_date, boat_class_id, timeline_view), each_serializer: BookingCalendarSerializer
  end

  def update_notes
    if @booking.update_attribute(:user_notes, booking_update_notes_params[:user_notes])
      render_message_growl 'Updated notes successfully'
    else
      render_message_error_growl 'Update notes failed, please try again later!'
    end
  end

  def calculate_refund_amount
    cancellation_time = Time.zone.now
    new_start_date = Date.parse(params[:new_start_date]) if params[:new_start_date]
    new_end_date = Date.parse(params[:new_end_date]) if params[:new_end_date]
    auto_fee = BookingAutoFeeService.new(@booking, cancellation_time, @booking.user.is_unlimited?).perform
    render json: {
      refund:   BookingRefundAmountService.new(
        booking:           @booking,
        cancellation_time: cancellation_time,
        new_start_date: new_start_date,
        new_end_date: new_end_date
      ).perform,
      auto_fee: auto_fee[:amount]
    }
  end

  def happy_hour_price
    boat_class = BoatClass.find params[:boat_class_id]
    user = User.find params[:user_id]
    render json: GetPriceService.new(user, boat_class, Time.zone.now, true).perform
  end

  def bookings_red_flags
  end

  private
    def booking_params
      params.require(:booking).permit(
        :user_id, :boat_class_id, :start_date, :end_date, :departure_time, :system_notes,
        :booking_type, :discount_percent, :user_notes, :is_admin_override, :discount_notes,
        payment_methods: [],
        booking_addons_attributes: [ :addon_id, :quantity ]
      )
    end

    def update_booking_params
      params.require(:booking).permit(
        :start_date, :end_date, :departure_time, :system_notes,
        :discount_percent, :user_notes, :is_admin_override,
        payment_methods: []
      )
    end

    def booking_complete_params
      params.require(:booking).permit(
        :complete_notes,
        booking_line_items_attributes: [
          :booking_id, :booking_checklist_line_item_id, :line_item_type, :value, :value_string ])
    end

    def booking_update_notes_params
      params.require(:booking).permit(:user_notes)
    end

    def get_booking
      @booking = Booking.find(params[:id])
    end

  def security_deposit_params
    params.permit(:security_deposit_amount, :security_deposit, :security_deposit_stripe_token)
  end
end
