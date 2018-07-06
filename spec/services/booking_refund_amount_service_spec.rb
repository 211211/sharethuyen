require "rails_helper"

describe BookingRefundAmountService do
  it "should return correct refund amount" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date:     "2016-11-16".to_date,
      end_date:       "2016-11-17".to_date,
      charges:        [
        Charge.new(
          amount:      300.0,
          status:      :succeeded,
          charge_type: :booking
        )
      ],
      discount_percent: 0.0,
      amount_detail:    amount_detail.to_json
    )
    cancellation_time = Time.zone.parse("2016-11-15 10:00")
    class_double("RemoveScheduledReminderEmailJob")
    result = BookingRefundAmountService.new(
      booking:           booking,
      cancellation_time: cancellation_time
    ).perform

    expect(result).to eq(50.0 + 60.0)
  end

  it "should exclude dates for in case booking's dates got changed" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date:     "2016-11-16".to_date,
      end_date:       "2016-11-17".to_date,
      charges:        [
        Charge.new(
          amount:      300.0,
          status:      :succeeded,
          charge_type: :booking
        )
      ],
      discount_percent: 0.0,
      amount_detail:    amount_detail.to_json
    )
    cancellation_time = Time.zone.parse("2016-11-15 10:00")
    class_double("RemoveScheduledReminderEmailJob")
    result = BookingRefundAmountService.new(
      booking:           booking,
      cancellation_time: cancellation_time,
      new_start_date:    "2016-11-17".to_date,
      new_end_date:      "2016-11-18".to_date
    ).perform

    expect(result).to eq(50.0)
  end

  it "should use params dates if defined" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = Booking.new(
      start_date:     "2016-11-19".to_date,
      end_date:       "2016-11-20".to_date,
      charges:        [
        Charge.new(
          amount:      300.0,
          status:      :succeeded,
          charge_type: :booking
        )
      ],
      discount_percent: 0.0,
      amount_detail:    amount_detail.to_json
    )
    cancellation_time = Time.zone.parse("2016-11-15 10:00")
    class_double("RemoveScheduledReminderEmailJob")
    result = BookingRefundAmountService.new(
      booking:           booking,
      cancellation_time: cancellation_time,
      new_start_date:    "2016-11-17".to_date,
      new_end_date:      "2016-11-18".to_date,
      start_date:        "2016-11-16".to_date,
      end_date:          "2016-11-17".to_date
    ).perform

    expect(result).to eq(50.0)
  end

  it "should include paid addons charge in refund amount" do
    amount_detail = {
      "11/16/2016": 200.0,
      "11/17/2016": 120.0
    }
    booking = build(
      :booking,
      start_date:     "2016-11-19".to_date,
      end_date:       "2016-11-20".to_date,
      charges:        [
        build(
          :charge,
          amount:      300.0,
          status:      :succeeded,
          charge_type: :booking
        ),
        build(
          :charge,
          amount:      100,
          status:      :succeeded,
          charge_type: :e_commerce
        ),
        build(
          :charge,
          amount:      50,
          status:      :succeeded,
          charge_type: :e_commerce
        ),
        build(
          :charge,
          amount:      50,
          status:      :created,
          charge_type: :e_commerce
        )
      ],
      discount_percent: 0.0,
      amount_detail:    amount_detail.to_json
    )
    cancellation_time = Time.zone.parse("2016-11-15 10:00")
    class_double("RemoveScheduledReminderEmailJob")
    result = BookingRefundAmountService.new(
      booking:           booking,
      cancellation_time: cancellation_time,
      new_start_date:    "2016-11-17".to_date,
      new_end_date:      "2016-11-18".to_date,
      start_date:        "2016-11-16".to_date,
      end_date:          "2016-11-17".to_date
    ).perform

    expect(result).to eq(50.0 + 150.0)
  end
end
