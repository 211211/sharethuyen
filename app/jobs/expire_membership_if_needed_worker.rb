class ExpireMembershipIfNeededWorker
  include Sidekiq::Worker

  def perform()
    current_date = Time.zone.now.to_date
    start_tier1_date = current_date + Setting.tier_1_before_day.to_i.days
    end_tier2_date = current_date - Setting.tier_2_after_day.to_i.days

    # Tier 1
    tier_1_users = User.paid.where(membership_valid_until: start_tier1_date).without_role(:unlimited).without_role(:daily)
    tier_1_users.each do |user|
      CreateRenewalMembershipChargeService.new(user).perform
    end

    # Expire and start tier 2
    expired_users = User.paid.where("membership_valid_until <= ? ", current_date).without_role(:unlimited).without_role(:daily)
    expired_users.each do |user|
      user.expired!
      CreateRenewalMembershipChargeService.new(user).perform
    end

    # Tier 2
    tier_2_users = User.expired.where(membership_valid_until: end_tier2_date).without_role(:unlimited).without_role(:daily)
    tier_2_users.each do |user|
      CreateRenewalMembershipChargeService.new(user).perform
    end
  end
end