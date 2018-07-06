class BoatFuelLog < ApplicationRecord
  enum log_type: [ :fill_up, :usage, :reset_meter, :enable_meter_system, :disable_meter_system, :edit_fuel ]
  belongs_to :boat
  belongs_to :booking, optional: true
  belongs_to :charge, optional: true
end