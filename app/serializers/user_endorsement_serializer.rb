class UserEndorsementSerializer < ActiveModel::Serializer
  attributes :id, :email, :full_name, :endorsement, :endorsement_check_list

  def endorsement_check_list
    Setting.endorsement_check_list
  end

  has_many :user_profile, serializer: UserProfileSerializer
  has_many :boat_class_ids
  has_many :boat_classes

end
