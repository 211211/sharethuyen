class UserBookingSerializer < ActiveModel::Serializer
  attributes :id, :email, :full_name, :first_name, :last_name, :membership_type, :balance,
    :is_active, :address, :stripe_customer_id, :billing_addresses,
    :membership_status, :shared_membership_status, :red_flag, :boat_class_ids, :membership_valid_until

  def shared_membership_status
    if object.group.present?
      object.group.membership_status
    end
  end

  def membership_valid_until
    object.membership_valid_until.to_s
  end
end
