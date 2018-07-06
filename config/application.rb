require_relative 'boot'

require 'csv'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RailsSeed
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.active_job.queue_adapter = :sidekiq

    config.rubix = {
      direction: 'ltr'
    }
    config.generators.stylesheets = false
    config.generators.javascripts = false

    config.react.server_renderer = React::ServerRendering::SprocketsRenderer

    config.react.addons = true

    config.assets.paths << Rails.root.join("public")

    config.action_mailer.default_url_options = { host: ENV['VIRTUAL_HOST'] }
    config.action_mailer.asset_host = "http://#{ENV['VIRTUAL_HOST']}"

    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      :address              => ENV['mailer_stmp'],
      :port                 => ENV['mailer_smtp_port'],
      :user_name            => ENV['mailer_username'],
      :password             => ENV['mailer_password'],
      :authentication       => :login,
      :enable_starttls_auto => true
    }

    config.time_zone = 'America/Los_Angeles'
  end
end

Raven.configure do |config|
  config.dsn = ENV['SENTRY_DSN']
end
