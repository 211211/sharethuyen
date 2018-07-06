class Booking < ApplicationRecord
  # TODO: Should remove this after migration data
  # In "848 - 13. Update to STATUS sort in bookings" story
  # We add no_show field directly to booking model in order to filter
  include RailsSettings::Extend

  before_save :update_departure_time
  scope :not_cancelled, -> { where.not(status: Booking.statuses[:cancelled]) }

  belongs_to :user
  belongs_to :boat_class
  belongs_to :boat, optional: true
  belongs_to :assigned_staff, class_name: 'User', optional: true
  belongs_to :activated_staff, class_name: 'User', optional: true
  belongs_to :completed_staff, class_name: 'User', optional: true
  has_many :transactions, dependent: :nullify
  has_many :charges, dependent: :nullify
  has_many :booking_images, dependent: :destroy
  has_many :booking_line_items, dependent: :destroy
  has_many :boat_fuel_log, dependent: :nullify
  has_many :service_requests, -> { where(resolved: false) }, dependent: :destroy
  has_many :soses, -> { where(resolved: false) }, dependent: :destroy
  has_many :booking_addons
  has_one :security_deposit_charge, -> { where charge_type: :booking_security_deposit }, class_name: 'Charge'

  accepts_nested_attributes_for :booking_line_items, :booking_addons

  enum booking_type: [ :normal, :happy_hour, :admin_use, :lesson_use ]

  #Flow tba -> confirmed -> in_use -> checked_in -> completed
  enum status: [ :tba, :confirmed, :in_use, :completed, :cancelled, :checked_in, :processing ]

  attr_accessor :payment_methods # Use for booking charges only

  validates :discount_percent, inclusion: { in: 0..100 }

  #
  # Pay all charges with status created or failed
  #
  def pay_now(current_user)
    charges = self.charges.ransack({
      status_in: [
        Charge.statuses[:created],
        Charge.statuses[:failed]
      ]
    }).result
    charges.map { |charge|
      charge.pay_now(self.user, current_user)
    }
  end

  def booking_reach_limit?
    booking_reach_limit = false

    return booking_reach_limit if is_admin_override?

    if BookingService.on_weekend_holiday?(start_date, end_date)
      shared_group = self.user.group
      if shared_group.present? && shared_group.shared?
        active_bookings = self.user.group.active_bookings(id)

        #TODO: Cannot figure out why self not loaded in group.active_bookings
        max_weekend_day = BookingService.max_weekend_holiday_for_group(shared_group)

        count = BookingService.count_weekend_holiday(start_date, end_date)
        active_bookings.each { |booking|
          count += BookingService.count_weekend_holiday(booking.start_date, booking.end_date)
        }
        if count > max_weekend_day
          booking_reach_limit = true
        end
      elsif self.user.is_user_single? || self.user.is_unlimited? || self.user.is_daily?
        active_bookings = self.user.active_bookings(id)

        #TODO: Cannot figure out why self loaded in user.active_bookings
        count = 0
        active_bookings.each { |booking|
          count += BookingService.count_weekend_holiday(booking.start_date, booking.end_date)
        }
        if count > 2
          booking_reach_limit = true
        end
      end
    end
    booking_reach_limit
  end

  #
  # This method help to check if a there is at least one boat available
  # for booking range
  #
  def no_boat_available?
    num_of_not_yard_status_boat = Boat.where(boat_class_id: self.boat_class_id).not_in_yard.count
    num_of_not_yard_by_date = Boat.ransack(
        boat_class_id_eq: self.boat_class_id,
        status_eq:        Boat.statuses[:yard],
        yard_end_date_lt: self.start_date
    ).result.count

    num_of_boat_blocked = BookingNumOfBoatBlockedService.new(self).perform

    num_boats_of_class = num_of_not_yard_status_boat + num_of_not_yard_by_date - num_of_boat_blocked
    num_booking_of_class_q = {
      start_date_or_end_date_in:              self.start_date..self.end_date,
      status_in:                              [
        Booking.statuses[:tba],
        Booking.statuses[:confirmed],
        Booking.statuses[:in_use],
        Booking.statuses[:processing]
      ],
      g: [{
        boat_boat_class_id_eq: boat_class_id,
        g: [{
          boat_id_present: 0,
          boat_class_id_eq: boat_class_id
        }],
        m: "or"
      }]
    }
    num_booking_of_class_q[:id_not_eq] = id if id.present?
    num_booking_of_class = Booking.ransack(num_booking_of_class_q).result.length

    # 877 - 2 bookings per day
    # Doesnot count those booking with departure_time after Setting.second_booking_depart_from
    second_booking_depart_from = Setting.second_booking_depart_from
    return num_booking_of_class >= num_boats_of_class if second_booking_depart_from.blank?
    num_of_late_booking_on_end_date_q = {
      start_date_eq:                          end_date,
      departure_time_in_sec_gteq:             Setting.second_booking_depart_from,
      status_in:                              [
        Booking.statuses[:tba],
        Booking.statuses[:confirmed],
        Booking.statuses[:in_use],
        Booking.statuses[:processing]
      ],
      g: [{
        boat_boat_class_id_eq: boat_class_id,
        g: [{
          boat_id_present: 0,
          boat_class_id_eq: boat_class_id
        }],
        m: "or"
      }]
    }
    num_of_late_booking_on_end_date_q[:id_not_eq] = id if id.present?
    num_of_late_booking_on_end_date = Booking.ransack(num_of_late_booking_on_end_date_q).result.length

    (num_booking_of_class - num_of_late_booking_on_end_date) >= num_boats_of_class
  end

  def valid_boat_class?
    self.user.boat_classes.exists?(self.boat_class.id)
  end

  def booking_out_of_season?
    season_start_date = Date.parse(Setting.season_start_date)
    season_end_date = Date.parse(Setting.season_end_date)
    self.start_date > season_end_date || self.end_date < season_start_date
  end

  def calculate_paid_booking_charge(tax_included = false)
    booking_amount = 0
    method = tax_included ? 'amount_after_tax' : 'amount'
    self.charges.each { |charge|
      if charge.booking? && charge.succeeded?
        booking_amount += charge.send(method)
      end
    }
    booking_amount
  end

  def booking_valid_membership?
    result = {
      key: :success
    }
    user = self.user

    if user.membership_type == 'daily'
      return result
    end

    membership_charge = user.current_membership_charge
    unless membership_charge.succeeded?
      result = {
        key: :fail,
        msg_key: :membership_charge_not_paid
      }
    else
      if user.group.blank?
        if user.is_mid_week?
          if BookingService.on_weekend_holiday?(self.start_date, self.end_date)
            result = {
              key: :fail,
              msg_key: :mid_week_membership_on_weekend
            }
          end
        else
          # TODO: Check full membership
        end
      end
    end
    result
  end

  def start_process_check_in
    if self.in_use?
      # self.update_attributes(check_in_boat_at: Time.now) if check_in_boat_at.blank? ---- Need to confirm this
      self.processing!

      # TODO: The boat status processing is not used anywhere?? Consider to clean up soon
      self.boat.processing! if (!self.boat.processing? && !self.boat.yard?)
    end
  end

  def check_in_boat(complete_notes, need_attention)
    assign_attributes(
      status: :checked_in,
      check_in_boat_at: Time.now,
      complete_notes: complete_notes,
      fuel_end: boat.fuel_remain
    )

    save(validate: false)

    if complete_notes.present?
      # Should notify for all admin
      BookingCompleteAdminMailer.send_notification_email(self)
    end

    return unless boat.present?
    if need_attention
      boat.need_attention!
    else
      boat.dock! if !boat.yard?
    end

    # Reset boat location infor. So it won't show on map
    boat.update!(
      location_updated_at: nil,
      latitude: nil,
      longitude: nil
    )
  end

  def complete_booking(staff, need_attention, request_a_review)
    ReturnBookingSecurityDepositCharges.new(staff, self).perform

    update_attribute(:status, :completed)

    # Send mail for user
    BookingMailer.completed_notification(self, request_a_review).deliver_later
  end

  def get_departure_time
    time = (self.start_date.to_s(:full_calendar) + " #{self.departure_time}")
    Time.zone.parse(time)
  end

  def self.to_be_assigned(start_date, end_date, boat_class_id = nil, timeline_view = nil)
    where_query = {
      start_date_or_end_date_in: start_date..end_date - 1.day,
      boat_id_null: 1
    }
    if timeline_view == 'timelineDay'
      where_query.delete(:start_date_or_end_date_in)
      where_query[:start_date_eq] = start_date
    end
    unless boat_class_id.nil?
      where_query[:boat_class_id_eq] = boat_class_id
    end

    booking_ransack = Booking.not_cancelled.ransack(where_query)
    booking_ransack.sorts = 'boat_class_name asc'

    reassign_query = {
        status_eq: Booking.statuses[:confirmed],
        boat_status_eq: Boat.statuses[:yard],
        start_date_or_end_date_in: start_date..end_date - 1.day
    }
    if timeline_view == 'timelineDay'
      reassign_query.delete(:start_date_or_end_date_in)
      reassign_query[:start_date_eq] = start_date
    end
    booking_reassign = Booking.not_cancelled.ransack(reassign_query).result

    booking_to_be_assigned = booking_ransack.result + booking_reassign
    if timeline_view.present? && (timeline_view == 'timelineDay' || timeline_view == 'timelineWeek')
      booking_to_be_assigned = booking_to_be_assigned.sort { |booking_a, booking_b|
        booking_a_depart_time = booking_a.get_departure_time
        booking_b_depart_time = booking_b.get_departure_time
        booking_a_depart_time <=> booking_b_depart_time
      }
    end
    booking_to_be_assigned
  end

  # This method used to get booking amount
  # by query all charges with type :booking
  def booking_amount
    self.charges.booking.inject(0){|sum, charge| sum + charge.amount}
  end

  def booking_amount_of_tax
    self.charges.booking.inject(0){|sum, charge| sum + charge.amount_of_tax}
  end

  def booking_amount_after_tax
    self.charges.booking.inject(0){|sum, charge| sum + charge.amount_after_tax}
  end

  def amount_after_discounted
    amount - amount_of_discount
  end

  def amount_of_discount
    amount * discount_percent.to_f / 100
  end

  def is_on_weekend
    BookingService.on_weekend_holiday?(self.start_date, self.end_date)
  end

  ransacker :status_in_text, formatter: proc { |status_text|
    status = status_text.parameterize(separator: '_')

    booking_ids = []
    if statuses.keys.include?(status)
      booking_ids = Booking.where(status: status).pluck(:id)
    end

    booking_ids.present? ? booking_ids : nil
  }  do |parent|
    parent.table[:id]
  end

  private

  def update_departure_time
    return if departure_time.blank?
    departure_time_with_date = Time.zone.parse(departure_time)
    departure_time_in_sec = (departure_time_with_date - Time.zone.now.beginning_of_day).to_i / 60
    self.departure_time_in_sec = departure_time_in_sec
  end
end
