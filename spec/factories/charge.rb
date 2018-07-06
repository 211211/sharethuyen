FactoryBot.define do
  factory :charge do
    amount 20.0
    charge_type :booking
    status :succeeded
    association :staff, factory: :user
    association :booking, factory: :booking
    trait :with_ref_charge do
      association :ref_charge, factory: :charge
    end
    :user
  end
end
