FactoryBot.define do
  factory :boat do
    sequence(:name){|n| "Chaparral #{n}" }
    description 'Day cruiser, family fun'
    association :boat_class, factory: :boat_class
  end
end
