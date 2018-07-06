FactoryBot.define do
  factory :boat_yard_log do
    start_date { Date.new(2017, 11, 15) }
    end_date { Date.new(2018, 03, 15) }
  end
end
