FactoryBot.define do
  factory :addon do
    name "Dummy Name"
    quantity 10
    price 5
    price_strategy :per_booking
  end
end
