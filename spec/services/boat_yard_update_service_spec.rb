require "rails_helper"

describe BoatYardUpdateService do
  it "should create boat_yard_log" do
    boat = create(:boat,
      status: :dock
    )
    BoatYardUpdateService.new(
      boat,
      {
        yard_end_date: "2018-06-15",
        status: :yard
      },
      "2018-05-12".to_date
    ).perform

    last_record_after = BoatYardLog.last
    expect(last_record_after.boat_id).to eq(boat.id)
    expect(last_record_after.start_date).to eq("2018-05-12".to_date)
    expect(last_record_after.end_date).to eq("2018-06-15".to_date)
  end

  #
  # Should update latest log record if change the yard_end_date for a yard boat
  # 1. Boat A had a yard log with start_date: Jun 01, end_date Jun 25
  # 2. Update yard end date to Jul 02 on Jun 18
  # 3. Old yard log updated (start_date: Jun 01, end_date: Jul 02)
  #
  it "should update last boat_yard_log record if change the yard_end_date for a yard boat" do
    boat = create(:boat,
      status: :yard
    )
    create(:boat_yard_log,
      boat: boat,
      start_date: "2018-05-01".to_date,
      end_date: "2018-05-05".to_date
    )
    last_record_before = create(:boat_yard_log,
      boat: boat,
      start_date: "2018-06-01".to_date,
      end_date: "2018-06-25".to_date
    )
    BoatYardUpdateService.new(
      boat,
      {
        yard_end_date: "2018-07-02",
        status: :yard
      },
      "2018-06-18".to_date
    ).perform

    last_record_after = BoatYardLog.last
    expect(last_record_after.id).to eq(last_record_before.id)
    expect(last_record_after.start_date).to eq("2018-06-01".to_date)
    expect(last_record_after.end_date).to eq("2018-07-02".to_date)
  end

  #
  # Should old log end_date updated to blank
  # 1. Boat A had a yard log with start_date: Jun 01, end_date Jun 25
  # 2. Update yard end date to blank on Jun 18
  # 3. Old yard log updated (start_date: Jun 01, end_date: blank)
  #
  it "should old log end_date updated to blank" do
    boat = create(:boat,
      status: :yard,
      yard_end_date: "2018-06-25".to_date
    )
    last_record_before = create(:boat_yard_log,
      boat: boat,
      start_date: "2018-06-01".to_date,
      end_date: "2018-06-25".to_date
    )
    BoatYardUpdateService.new(
      boat,
      {
        yard_end_date: nil,
        status: :yard
      },
      "2018-06-18".to_date
    ).perform

    last_record_after = BoatYardLog.last
    expect(last_record_after.id).to eq(last_record_before.id)
    expect(last_record_after.start_date).to eq("2018-06-01".to_date)
    expect(last_record_after.end_date).to eq(nil)
  end

  #
  # Should create new boat_yard_log record if there is no historical record
  # 1. Boat A in yard status. No yard log was created before
  # 2. Update status of Boat A to dock on Jun 18
  # 3. New yard log created (start_date: Jun 18, end_date: Jun 18)
  #
  it "should create new boat_yard_log record if there is no historical record" do
    boat = create(:boat,
      status: :yard
    )
    BoatYardUpdateService.new(
      boat,
      {
        status: :dock
      },
      "2018-06-18".to_date
    ).perform
    log_count = BoatYardLog.where(boat_id: boat.id).count
    expect(log_count).to eq(0)
  end

  #
  # Shouldnot create boat_yard_log record if there is no historical record 2
  # Most of the time, the boat with yard status always have yard log record
  # 1. Boat A in yard status. No yard log was created before
  # 2. Update yard_end_date of Boat A to Jun 25 on Jun 18
  # 3. No yard log created
  #
  it "shouldnot create boat_yard_log record if there is no historical record 2" do
    boat = create(:boat,
      status: :yard
    )
    BoatYardUpdateService.new(
      boat,
      {
        status: :yard,
        yard_end_date: "2018-06-25"
      },
      "2018-06-18".to_date
    ).perform
    log_count = BoatYardLog.where(boat_id: boat.id).count
    expect(log_count).to eq(0)
  end

  #
  # Should clean old invalid data
  # 1. Boat A in dock had two yard logs:
  #     - A. start: Jun 18, end: Jun 18
  #     - B. start: Jun 15, end: nil
  #     - C. start: Apr 01, end: Apr 10
  # 2. Update of Boat A to yard with yard_end_date to Jun 25 on Jun 18
  # 3. New yard log created (start_date: Jun 18, end_date: Jun 25)
  # 4. Log record A, B should be cleaned
  #
  it "should clean old invalid data" do
    boat = create(:boat,
      status: :dock
    )
    create(:boat_yard_log,
      boat: boat,
      start_date: "2018-06-18".to_date,
      end_date: "2018-06-18".to_date
    )
    create(:boat_yard_log,
      boat: boat,
      start_date: "2018-06-15".to_date,
      end_date: nil
    )
    create(:boat_yard_log,
      boat: boat,
      start_date: "2018-04-01".to_date,
      end_date: "2018-04-10".to_date
    )
    BoatYardUpdateService.new(
      boat,
      {
        status: :yard,
        yard_end_date: "2018-06-25"
      },
      "2018-06-18".to_date
    ).perform
    logs = BoatYardLog.where(boat_id: boat.id)
    expect(logs.count).to eq(2)
    expect(logs[0].start_date).to eq("2018-04-01".to_date)
    expect(logs[0].end_date).to eq("2018-04-10".to_date)
    expect(logs[1].start_date).to eq("2018-06-18".to_date)
    expect(logs[1].end_date).to eq("2018-06-25".to_date)
  end

  #
  # Should back to dock one day before from the date move yard boat to dock
  # The idea is to have the boat ready for new booking
  # 1. Boat A in yard had yard log:
  #     - start: Jun 18, end: Jun 25
  # 2. Update of Boat A to dock on Jun 22
  # 3. Yard log updated (start_date: Jun 18, end_date: Jun 21)
  #
  it "should back to dock one day before from the date move yard boat to dock" do
    boat = create(:boat,
      status: :yard
    )
    boat_yard_log_before = create(:boat_yard_log,
      boat: boat,
      start_date: "2018-06-18".to_date,
      end_date: "2018-06-25".to_date
    )
    BoatYardUpdateService.new(
      boat,
      {
        status: :dock
      },
      "2018-06-22".to_date
    ).perform
    latest_log = BoatYardLog.last
    expect(latest_log.id).to eq(boat_yard_log_before.id)
    expect(latest_log.start_date).to eq("2018-06-18".to_date)
    expect(latest_log.end_date).to eq("2018-06-21".to_date)
  end

  #
  # Should remove boat_yard_log record if change boat from dock to yard, then to dock at the same day
  # The idea here is that, the boat now ready for booking
  # 1. Boat A in dock status
  # 2. Boat A update from dock to yard with yard_end_date is "2018-06-25" on "2018-06-22"
  # 3. New log will be created from "2018-06-22" to "2018-06-25"
  # 4. Boat A update form yard to dock on "2018-06-22"
  # 5. Old log will be remove
  #
  it "should remove boat_yard_log record if change boat from dock to yard, then to dock at the same day" do
    boat = create(:boat,
      status: :dock
    )
    BoatYardUpdateService.new(
      boat,
      {
        status: :yard,
        yard_end_date: "2018-06-25"
      },
      "2018-06-22".to_date
    ).perform
    last_log = BoatYardLog.last
    boat.update_attribute(:status, :yard)
    expect(last_log.boat_id).to eq(boat.id)
    expect(last_log.start_date).to eq(Date.parse("2018-06-22"))
    expect(last_log.end_date).to eq(Date.parse("2018-06-25"))
    BoatYardUpdateService.new(
      boat,
      {
        status: :dock
      },
      "2018-06-22".to_date
    ).perform
    expect(BoatYardLog.find_by(id: last_log.id)).to be_nil
  end
end
