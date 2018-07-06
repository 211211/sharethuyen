FactoryBot.define do
  factory :booking_addon do
    status :paid
    price 10
    association :addon, factory: :addon
    association :booking, factory: :booking
    association :charge, factory: :charge
  end
end
