class GroupService

  def self.add_users_to_group(group, user_ids)
    messages = []

    del_user_ids = group.user_ids - user_ids
    add_user_ids = user_ids - group.user_ids

    del_user_ids.each { |user_id|
      user = User.find user_id
      membership_charge = user.current_membership_charge
      security_deposit_charge = user.security_deposit_charge

      if membership_charge.able_to_change? && security_deposit_charge.able_to_change?
        amount = Setting.membership_single_user
        membership_charge.update_attribute(:amount, amount)

        amount = Setting.security_deposit_single_user
        security_deposit_charge.update_attribute(:amount, amount)

        if user.has_role? :mid_week
          user.remove_role :mid_week
        end
        user.add_role :user_single
        group.users.delete(user)
      else
        messages << "#{user.email} is paid user. Cannot remove out of group"
      end
    }

    add_user_ids.each { |user_id|
      user = User.find user_id
      membership_charge = user.current_membership_charge
      security_deposit_charge = user.security_deposit_charge

      if membership_charge.able_to_change? && security_deposit_charge.able_to_change?
        amount = Setting.membership_group_user
        membership_charge.update_attribute(:amount, amount)

        amount = Setting.security_deposit_group_user
        security_deposit_charge.update_attribute(:amount, amount)
      end

      group.users << user
      group.remove_pending_invitation(user.email)
    }
    messages
  end
end
