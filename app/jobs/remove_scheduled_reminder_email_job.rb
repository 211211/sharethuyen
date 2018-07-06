class RemoveScheduledReminderEmailJob < ApplicationJob
  queue_as :default

  def perform(booking_id)
    schedule_set = Sidekiq::ScheduledSet.new
    jobs = schedule_set.select do |job|
      global_id = "Booking/#{booking_id}"

      job.display_class == 'UpcomingBookingMailer#remind_email' &&
          job.display_args.first['_aj_globalid'].include?(global_id)
    end

    jobs.each(&:delete)
  end
end
