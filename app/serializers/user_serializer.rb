class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :full_name, :first_name, :last_name, :phone, :secondary_phone,
    :profile_picture_url, :profile_picture_thumb_url, :membership_type, :balance,
    :is_active, :address, :stripe_customer_id, :created_at, :updated_at,
    :membership_status, :shared_membership_status, :is_added_payment_method,
    :is_paid_membership_charges, :red_flag, :boat_class_ids, :role, 
    :membership_valid_until, :confirmed, :main_role

  # TODO: Should remove this later
  def role
    object.roles.first.present? ? object.roles.first.id : nil
  end

  def main_role
    object.get_main_role
  end

  has_one :security_deposit_charge, serializer: ChargeSerializer
  has_one :current_membership_charge, serializer: ChargeSerializer
  has_one :current_membership_waitlist, serializer: MembershipWaitlistSerializer
  has_many :billing_addresses
  has_many :membership_charges, serializer: ChargeSerializer
  has_many :user_profile, serializer: UserProfileSerializer

  def profile_picture_url
    object.profile_picture.url
  end

  def profile_picture_thumb_url
    if object.profile_picture.thumb.url.present?
      object.profile_picture.thumb.url
    else
      '/imgs/app/avatars/avatar0.png'
    end
  end

  def shared_membership_status
    if object.group.present?
      object.group.membership_status
    end
  end

  def membership_valid_until
    object.membership_valid_until.to_s
  end

  def confirmed
    object.confirmed?
  end
end
