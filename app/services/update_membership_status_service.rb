class UpdateMembershipStatusService
  def initialize(user, membership_charge)
    @user = user
    @membership_charge = membership_charge
  end

  def perform
    return unless @membership_charge.succeeded?

    current_membership_valid_until = @user.membership_valid_until || Time.zone.now

    if @user.membership_status == :expired
      current_membership_valid_until = Time.zone.now
    end

    @user.membership_valid_until = current_membership_valid_until + 1.year
    @user.membership_status = User.membership_statuses[:paid]
    @user.save
  end
end