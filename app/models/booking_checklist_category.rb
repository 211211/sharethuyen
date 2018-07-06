class BookingChecklistCategory < ApplicationRecord
  has_and_belongs_to_many :boats
  has_many :line_items, :foreign_key => 'category_id', :class_name => 'BookingChecklistLineItem'
  validates :name, presence: true, uniqueness: true
  accepts_nested_attributes_for :line_items, allow_destroy: true
end
