class BookingAddonSerializer < ActiveModel::Serializer
  attributes  :id, :addon_id, :booking_id, :quantity, 
              :created_at, :updated_at, :status, :price

  has_one :addon
  has_one :booking
  has_one :charge
  def created_at
    object.created_at.to_s
  end
end
