FactoryBot.define do
  factory :boat_class do
    sequence(:name){|n| "Boat Class #{n}" }
  end
end
