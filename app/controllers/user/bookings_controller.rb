class User::BookingsController < User::UserController
  before_action :authenticate_user!
  before_action :get_booking, only: [:show, :pay_now, :cancel, :calculate_refund_amount]

  def new
  end

  def show
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

  def create
    booking = current_user.bookings.build(booking_params)

    if current_user.membership_type == 'unlimited'
      booking.discount_percent = 100
    end

    valid_booking_check = BookingValidService.new(booking).perform
    unless valid_booking_check[:result] == :success

      # The error message can return from validation service
      # Otherwise, get message from language file
      error = valid_booking_check[:message].blank? ? t(valid_booking_check[:result]) : valid_booking_check[:message]
      render :json => {
        error: error
      }, :status => :bad_request and return
    end

    BookingPaymentAndSaveService.new(booking, current_user).perform

    user_serialized = ActiveModelSerializers::SerializableResource.new(current_user.reload)
    render json: { booking: booking, user: user_serialized.as_json } # No need to handle error for now because always raise exceptions
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
    cancellation_time = Time.zone.now
    cancel_booking_result = BookingCancelService.new(@booking, current_user, cancellation_time).perform
    if cancel_booking_result[:key] == :success
      user_serialized = ActiveModelSerializers::SerializableResource.new(current_user.reload)
      render json: { message: t(:booking_cancel_successfully), user: user_serialized.as_json }
    else
      render :json => { error: cancel_booking_result[:message] }, :status => :bad_request
    end
  end

  def booking_data_in_month
    render json: GetBookingDataInMonthService.new(
      user_id:       params[:user_id],
      boat_class_id: params[:boat_class_id],
      date:          params[:date],
      booking_id:    params[:booking_id]
    ).perform
  end

  def boat_class_prices_in_days
    render json: GetBoatClassPricesInDaysService.new(
      user_id:       params[:user_id],
      start_date:       params[:start_date],
      end_date:       params[:end_date]
    ).perform
  end

  def calculate_refund_amount
    cancellation_time = Time.zone.now
    auto_fee = BookingAutoFeeService.new(@booking, cancellation_time, @booking.user.is_unlimited?).perform
    render json: {
      refund:   BookingRefundAmountService.new(
        booking:           @booking,
        cancellation_time: cancellation_time
      ).perform,
      auto_fee: auto_fee[:amount]
    }
  end

  def happy_hour_price
    boat_class = BoatClass.find params[:boat_class_id]
    render json: GetPriceService.new(current_user, boat_class, Time.zone.now, true).perform
  end

  def get_booking_validation
    booking_settings = Setting.booking_settings
    booking_validation = {}
    if booking_settings.present?
      parsed_booking_settings = JSON.parse(booking_settings).to_h
      booking_reserve_hours = parsed_booking_settings["booking_reserve_hours"].to_i
      booking_validation[:booking_reserve_hours] = booking_reserve_hours

      booking_rules = parsed_booking_settings["booking_rules"]
      booking_validation[:booking_rules] = booking_rules
    end
    block_out_rules = Setting.block_out_rules
    if block_out_rules.present?
      parsed_block_out_rules = JSON.parse(block_out_rules)
      booking_validation[:block_out_rules] = parsed_block_out_rules
    end
    booking_validation[:last_reservation_by_date] = Setting.last_reservation_by_date
    render json: booking_validation
  end

  private

  def get_booking
    @booking = Booking.find(params[:id])
    if @booking.user.id != current_user.id
      # Current user cannot view booking belonged to another member
      user_not_authorized and return
    end
  end

  def booking_params
    params.require(:booking).permit(
      :boat_class_id, :start_date, :end_date, :booking_type, :departure_time, :user_notes,
      :system_notes,
      payment_methods: [],
      booking_addons_attributes: [ :addon_id, :quantity ]
    )
  end
end
