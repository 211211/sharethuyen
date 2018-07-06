require 'rails_helper'

describe BookingRefundAmountByDateService do

  it 'should return refund all money if cancellation time more than 72 hours & amount < 20' do
    date = "2016-11-16".to_date
    date_amount = 19
    cancellation_time = Time.zone.parse("2016-11-13 10:00")
    result = BookingRefundAmountByDateService.new(date, date_amount, cancellation_time, false, 0).perform

    expect(result).to eq(19)
  end

  it 'should return $20 flat-rate if cancellation time more than 72 hours' do
    date = "2016-11-16".to_date
    date_amount = 100.0
    cancellation_time = Time.zone.parse("2016-11-13 10:00")
    result = BookingRefundAmountByDateService.new(date, date_amount, cancellation_time, false, 0).perform

    expect(result).to eq(80)
  end


  it 'should return 50% booking fee if cancellation time less than 72 hours' do
    date = "2016-11-16".to_date
    date_amount = 100.0
    cancellation_time = Time.zone.parse("2016-11-14 10:00")
    result = BookingRefundAmountByDateService.new(date, date_amount, cancellation_time, false, 0).perform

    expect(result).to eq(50)
  end


  it 'should return 25% booking fee if cancellation time less than 48 hours' do
    date = "2016-11-16".to_date
    date_amount = 100.0
    cancellation_time = Time.zone.parse("2016-11-15 10:00")
    result = BookingRefundAmountByDateService.new(date, date_amount, cancellation_time, false, 0).perform

    expect(result).to eq(25)
  end

  it 'shouldnot return anything if cancellation time less than 24 hours' do
    date = "2016-11-16".to_date
    date_amount = 100.0
    cancellation_time = Time.zone.parse("2016-11-15 10:01")
    result = BookingRefundAmountByDateService.new(date, date_amount, cancellation_time, false, 0).perform

    expect(result).to eq(0)
  end
end
