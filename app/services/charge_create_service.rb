class ChargeCreateService

  def initialize(charge, staff, user, meta_params)
    @charge = charge
    @staff = staff
    @user = user
    @meta_params = meta_params
  end

  def perform
    return_data = {
      success: true
    }
    charge = @charge
    charge.apply_sale_tax_if_needed
    charge.staff = @staff
    charge.user = @user
    return_data[:charge] = charge

    meta_balance = @meta_params[:balance]
    # The balance from user may not updated, due to some charges are pending
    balance = [meta_balance, @user.balance].min

    if balance <= 0
      charge.set_default_source(@user.id)
      unless charge.save
        return_data[:success] = false
        return_data[:error_code] = :created_charge_fail
        return_data[:message] = charge.errors.full_messages
      end
    elsif balance < charge.amount_after_tax
      # Balance not enough, need to create another charge
      new_charge = charge.dup
      new_charge.ref_charge = charge
      new_charge.set_default_source(@user.id)
      user_balance_charge_amount = 100 * balance / (100 + new_charge.sale_tax_percent.to_f)
      new_charge.amount = charge.amount - user_balance_charge_amount
      charge.amount = user_balance_charge_amount
      charge.source = :user_balance

      unless new_charge.save && charge.save
        return_data[:success] = false
        return_data[:error_code] = :created_charge_fail
        if charge.invalid?
          return_data[:message] = charge.errors.full_messages
        end
        if new_charge.invalid?
          return_data[:message] = new_charge.errors.full_messages
        end
      end
    elsif balance >= charge.amount_after_tax
      charge.source = :user_balance
      unless charge.save
        return_data[:success] = false
        return_data[:error_code] = :created_charge_fail
        return_data[:message] = charge.errors.full_messages
      end
    end
    return_data
  end
end
