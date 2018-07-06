class BookingChecklistLineItem < ApplicationRecord
  belongs_to :category, class_name: 'BookingChecklistCategory'
end
