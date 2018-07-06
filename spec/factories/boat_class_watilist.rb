FactoryBot.define do
  factory :boat_class_waitlist do
    association :user, factory: :user
    association :boat_class, factory: :boat_class
  end
end
