require File.expand_path('../config/environment', __dir__)
env :PATH, ENV['PATH']
env :GEM_PATH, ENV['GEM_PATH']
env :REDIS_HOST, ENV["REDIS_HOST"] || ENV['REDIS_1_PORT_6379_TCP_ADDR']
env :APP_NAME, ENV["APP_NAME"]
env :RAILS_ENV, ENV["RAILS_ENV"]

job_type :sidekiq, "cd :path && :environment_variable=:environment /usr/local/bin/bundle exec /usr/local/bin/sidekiq-client push :task :output"

set :environment, Rails.env.to_sym
set :output, {:error => '/tmp/cron_errors.log', :standard => '/tmp/cron_debugs.log'}

every :day, :at => Time.zone.parse('02:00am').localtime, :roles => [:app] do
  sidekiq "StripeChargeStatusSyncWorker"
end

every :day, :at => Time.zone.parse('09:00pm').localtime, :roles => [:app] do
  sidekiq "CancelTodayBookingsWorker"
end

every :day, :at => Time.zone.parse('10:00pm').localtime, :roles => [:app] do
  sidekiq "ExpireMembershipIfNeededWorker"
end

every :day, :at => Time.zone.parse('08:00pm').localtime, :roles => [:app] do
  sidekiq "BackFromYardWarningWorker"
end
