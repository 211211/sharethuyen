class CreateRenewalMembershipChargeService
  def initialize(user)
    @user = user
  end

  def perform
    return if @user.membership_valid_until.blank? || @user.is_unlimited? || @user.is_daily?

    current_membership_charge = @user.current_membership_charge

    if current_membership_charge.present? && !current_membership_charge.succeeded?
      new_membership_charge = current_membership_charge
    else
      new_membership_charge = @user.membership_charges.create!(amount: 0)
    end

    current_date = Time.zone.now.to_date
    tier_1_start_day = @user.membership_valid_until - Setting.tier_1_before_day.to_i.days
    tier_2_end_day = @user.membership_valid_until + Setting.tier_2_after_day.to_i.days

    if current_date < tier_1_start_day || current_date >= tier_2_end_day # Before tier 1 or After tier 2
      if @user.group.present?
        amount = Setting.membership_group_user.to_f
      elsif @user.is_mid_week?
        amount = Setting.membership_mid_week_user.to_f
      else
        amount = Setting.membership_single_user.to_f
      end

      new_membership_charge.update_columns(amount: amount, discount_percent: Setting.renewal_discount_percent.to_f)
    elsif current_date >= tier_1_start_day && current_date < @user.membership_valid_until # Tier 1
      if @user.group.present?
        amount = Setting.group_user_renewal_price_tier1.to_f
      elsif @user.is_mid_week?
        amount = Setting.mid_week_user_renewal_price_tier1.to_f
      else
        amount = Setting.single_user_renewal_price_tier1.to_f
      end

      new_membership_charge.update_columns(amount: amount, discount_percent: 0)
    elsif current_date >= @user.membership_valid_until && current_date < tier_2_end_day
      if @user.group.present?
        amount = Setting.group_user_renewal_price_tier2.to_f
      elsif @user.is_mid_week?
        amount = Setting.mid_week_user_renewal_price_tier2.to_f
      else
        amount = Setting.single_user_renewal_price_tier2.to_f
      end

      new_membership_charge.update_columns(amount: amount, discount_percent: 0)
    end
  end
end