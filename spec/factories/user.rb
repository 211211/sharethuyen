FactoryBot.define do
  factory :user do |user|
    sequence(:email){|n| "user#{n}@example.com" }
    password '123456'
    first_name 'Test'
    last_name 'Test'
    balance 50
  end
end
