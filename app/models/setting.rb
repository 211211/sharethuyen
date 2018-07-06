# RailsSettings Model
class Setting < RailsSettings::Base
  after_commit :rewrite_cache

  source Rails.root.join("config/app.yml")
  namespace Rails.env
end
