class SettingSerializer < ActiveModel::Serializer
  attributes :id, :var, :value, :thing_id, :thing_type
end
