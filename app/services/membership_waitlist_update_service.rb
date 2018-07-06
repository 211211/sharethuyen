class MembershipWaitlistUpdateService
  def initialize(settings)
    @settings = settings
  end

  def perform
    return_result = {
      result: :success
    }
    @settings.each do |setting_params|
      key = setting_params[:key]
      value = setting_params[:value]
      stored_value = Setting[key]
      next if stored_value == value
      if key == "membership_waitlist_enabled" && !value && count_pending_waitlist.positive?
        # membership_waitlist_enabled is off
        return_result = {
          result: :pending_waitlist_new_user_not_empty
        }
      end
      if key == "membership_waitlist_expired_enabled" && !value && count_pending_expired_user_waitlist.positive?
        # membership_waitlist_expired_enabled is off
        return_result = {
          result: :pending_waitlist_expired_user_not_empty
        }
      end
    end

    return return_result if return_result[:result] != :success

    @settings.each do |setting_params|
      key = setting_params[:key]
      value = setting_params[:value]
      stored_value = Setting[key]
      stored_value != value && Setting[key] = value
    end
    return_result
  end

  private

  def count_pending_waitlist
    MembershipWaitlist.where(status: [:requested, :approved]).count
  end

  def count_pending_expired_user_waitlist
    MembershipWaitlist.ransack(
      status_in: [
        MembershipWaitlist.statuses[:requested],
        MembershipWaitlist.statuses[:approved]
      ],
      user_membership_status_eq: User.membership_statuses[:expired]
    ).result.count
  end
end
