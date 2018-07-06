class UpdateMemberChargesJob < ApplicationJob
  queue_as :default

  def perform(setting_key, new_setting_value)
    case setting_key
      when 'security_deposit_single_user'
        charges = Charge.security_deposit.created.includes(:user)
                      .where(users: {group_id: nil, id: User.with_role(:user_single).pluck(:id)})
      when 'security_deposit_daily_user'
        charges = Charge.security_deposit.created.includes(:user)
                      .where(users: {group_id: nil, id: User.with_role(:daily).pluck(:id)})
      when 'security_deposit_mid_week_user'
        charges = Charge.security_deposit.created.includes(:user)
                      .where(users: {group_id: nil, id: User.with_role(:mid_week).pluck(:id)})
      when 'security_deposit_unlimited_user'
        charges = Charge.security_deposit.created.includes(:user)
                      .where(users: {group_id: nil, id: User.with_role(:unlimited).pluck(:id)})
      when 'security_deposit_group_user'
        charges = Charge.security_deposit.created.includes(:user)
                      .where.not(users: {group_id: nil})
    end

    charges.each do |charge|
      charge.update_attribute(:amount, new_setting_value.to_f)
    end if charges.present?

    # MEMBERSHIP CHARGES
    if setting_key == 'membership_single_user'
      User.where(group_id: nil).with_role(:user_single).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            user.is_in_tier_1? ||
            user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'membership_mid_week_user'
      User.where(group_id: nil).with_role(:mid_week).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            user.is_in_tier_1? ||
            user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'membership_unlimited_user'
      User.where(group_id: nil).with_role(:unlimited).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            user.is_in_tier_1? ||
            user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'membership_group_user'
      User.where.not(group_id: nil).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            user.is_in_tier_1? ||
            user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    # RENEWAL MEMBERSHIP CHARGES
    # Tier 1
    if setting_key == 'single_user_renewal_price_tier1'
      User.paid.where(group_id: nil).with_role(:user_single).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_1?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'mid_week_user_renewal_price_tier1'
      User.paid.where(group_id: nil).with_role(:mid_week).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_1?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'group_user_renewal_price_tier1'
      User.paid.where.not(group_id: nil).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_1?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    # Tier 2
    if setting_key == 'single_user_renewal_price_tier2'
      User.expired.where(group_id: nil).with_role(:user_single).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'mid_week_user_renewal_price_tier2'
      User.expired.where(group_id: nil).with_role(:mid_week).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end

    if setting_key == 'group_user_renewal_price_tier2'
      User.expired.where.not(group_id: nil).each do |user|
        next if user.current_membership_charge.blank? ||
            !user.current_membership_charge.created? ||
            !user.is_in_tier_2?

        user.current_membership_charge.update_attribute(:amount, new_setting_value.to_f)
      end
    end
  end
end
