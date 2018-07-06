namespace :db do
  desc "Restores the database dump at db/app.sql"
  task :restore => :environment do
    cmd = nil
    with_config do |app, host, db, user|
      cmd = "psql -h #{host} -U #{user} -d #{db} -f #{Rails.root}/db/app.sql -W"
    end
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    puts cmd
    exec cmd
  end

  desc "Restores the database dump at db/app.sql using pd_restore, you will need PGPASSWORD env"
  task :pg_restore => :environment do
    cmd = nil
    with_config do |app, host, db, user|
      cmd = "pg_restore -Fc --no-owner --dbname #{db} -h #{host} -U #{user} -w #{Rails.root}/db/app.sql"
    end
    Rake::Task["db:drop"].invoke
    Rake::Task["db:create"].invoke
    puts cmd
    exec cmd
  end

  task :dump => :environment do
    cmd = nil
    with_config do |app, host, db, user|
      cmd = "pg_dump -h #{host} -U #{user} #{db} > #{Rails.root}/db.sql"
    end
    puts cmd
    exec cmd
  end

  namespace :seed do
    task :single => :environment do
      filename = Dir[File.join(Rails.root, 'db', 'seeds', "#{ENV['SEED']}.seeds.rb")][0]
      puts "Seeding #{filename}..."
      load(filename) if File.exist?(filename)
    end
  end

  private

  def with_config
    yield Rails.application.class.parent_name.underscore,
        ActiveRecord::Base.connection_config[:host],
        ActiveRecord::Base.connection_config[:database],
        ActiveRecord::Base.connection_config[:username]
  end
end