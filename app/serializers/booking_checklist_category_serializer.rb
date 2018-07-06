class BookingChecklistCategorySerializer < ActiveModel::Serializer
  attributes :id, :name

  has_many :line_items, serializer: BookingChecklistLineItemSerializer
end
