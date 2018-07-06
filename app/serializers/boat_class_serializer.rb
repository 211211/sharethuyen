class BoatClassSerializer < ActiveModel::Serializer
  attributes :id, :name, :color_hex, :admin_use, :order_number
end
