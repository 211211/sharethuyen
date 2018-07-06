require 'rails_helper'

describe BookingService do

  describe '.on_weekend_holiday?' do
    before(:all) do
      Setting.holidays = '[{"name": "Independence Day", "date": "2016-07-04"}]'
    end

    it 'return true for weekend' do
      start_date = Date.new(2016, 11, 18)
      end_date = Date.new(2016, 11, 20)

      expect(BookingService.on_weekend_holiday?(start_date, end_date)).to eq(true)
    end

    it 'return false for monday-friday' do
      start_date = Date.new(2016, 11, 14)
      end_date = Date.new(2016, 11, 18)

      expect(BookingService.on_weekend_holiday?(start_date, end_date)).to eq(false)
    end

    it 'return true on holiday' do
      start_date = Date.new(2016, 7, 4)
      end_date = Date.new(2016, 7, 6)

      expect(BookingService.on_weekend_holiday?(start_date, end_date)).to eq(true)
    end
  end
end
