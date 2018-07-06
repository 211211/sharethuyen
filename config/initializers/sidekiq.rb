require 'sidekiq/api'

redis_url = ENV['REDIS_1_PORT_6379_TCP_ADDR'] ? "redis://" + ENV['REDIS_1_PORT_6379_TCP_ADDR'] + ":6379" : "redis://#{ENV['REDIS_HOST']}:6379"

redis_config = { url: redis_url, namespace: "#{ENV['APP_NAME']}_#{ENV['RAILS_ENV']}" }

Sidekiq.configure_server do |config|
  config.redis = redis_config
end

Sidekiq.configure_client do |config|
  config.redis = redis_config
end
