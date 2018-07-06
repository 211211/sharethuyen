class AddonSerializer < ActiveModel::Serializer
  attributes  :id, :name, :price, :quantity, :price_strategy, :remaining,
              :created_at, :updated_at
end
