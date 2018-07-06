class LessonSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :price

  def price
    object.price_by_user(scope)
  end
end
