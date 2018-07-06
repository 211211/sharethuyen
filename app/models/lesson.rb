class Lesson < ApplicationRecord
  validates :name, :description, :price, presence: true

  def create_booking(user, date, payment_methods, booked_by_admin = false, discount_percent = 0)
    ActiveRecord::Base.transaction do
      discount_percent = booked_by_admin ? discount_percent : discount_percent_by_user(user)

      if payment_methods.size > 1
        sale_tax = Setting.lesson_charge_sale_tax ? Setting.sale_tax_percent : 0

        user_balance_charge_amount = (100 * 100 * user.balance) / ( (100 + sale_tax.to_f) * (100 - discount_percent.to_f) )

        additional_amount = price.to_i - user_balance_charge_amount

        Charge.create_lesson_charge!(user_balance_charge_amount, payment_methods.first, user, self, date, discount_percent)
        Charge.create_lesson_charge!(additional_amount, payment_methods.last, user, self, date, discount_percent)
      else
        Charge.create_lesson_charge!(price.to_i, payment_methods.first, user, self, date, discount_percent)
      end
    end
  end

  def price_by_user(user)
    if user.is_paid_membership_charges
      discount_percent = Setting.lesson_discount_percent || 100
      price.to_i - (price.to_i * discount_percent.to_i / 100)
    else
      price.to_i
    end
  end

  def discount_percent_by_user(user)
    user.is_paid_membership_charges ? Setting.lesson_discount_percent : 0
  end
end
