FactoryBot.define do
  factory :booking do
    start_date { Date.new(2016, 11, 15) }
    end_date { Date.new(2016, 11, 17) }
    association :user, factory: :user
    association :boat_class, factory: :boat_class
    association :boat, factory: :boat
    discount_percent 0

    factory :booking_with_charges do

      after(:create) do |booking|
        create_list(:charge, 1, booking: booking, sale_tax_percent: 10)
      end
    end
  end
end
