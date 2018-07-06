namespace :user do
  desc "Import users from CSV file"
  task :import => :environment do |t|
    csv_text = File.read(Rails.root.join("lib", "assets", "boaters.csv"))

    begin
      rows = ::CSV.parse(csv_text, headers: true)
    rescue ::CSV::MalformedCSVError => e
      rows = []
      errors << "Malformed CSV: #{e.message}"
    end

    rows.each_with_index do |row, index|
      #0: index, 1: last, 2: first, 3: email, 4: password, 5: phone
      if row.present?
        user = User.find_by_email(row[3])

        unless user.present?
          user = User.new({
                              last_name: row[1],
                              first_name: row[2],
                              email: row[3],
                              password: row[4],
                              password_confirmation: row[4],
                              phone: row[5]
                          })

          ActiveRecord::Base.transaction do
            user.create_user(false)
          end
        end
      end
    end
  end
end