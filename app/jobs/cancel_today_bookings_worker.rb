class CancelTodayBookingsWorker
  include Sidekiq::Worker

  def perform
    current_date = Time.zone.now.to_date
    CancelTodayBookingsService.new(current_date).perform
  end
end
