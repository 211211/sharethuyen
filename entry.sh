#!/bin/bash
cron
whenever --update-crontab
bundle exec sidekiq -C config/sidekiq.yml
