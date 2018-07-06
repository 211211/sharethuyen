namespace :data do
  # Correct data for [848 - 13. Update to STATUS sort in bookings]
  desc "Migrate booking.settings.no_show to booking.no_show"
  task :no_show_migrate_848 => :environment do |t|
    Booking.all.each do |booking|
      no_show = booking.settings.no_show
      if no_show
        booking.update_attribute(:no_show, no_show)
      end
    end and ''
  end

  desc "Correct is_current of membership charges"
  task :correct_is_current_membership_charges => :environment do |t|
    User.all.each do |user|
      current_membership_charge = user.membership_charges.first
      current_membership_charge.update_column(:is_current, true) if current_membership_charge
    end
  end

  desc "Update paid_on of all charges"
  task :update_paid_on_of_charges => :environment do |t|
    Charge.where(status: Charge.statuses[:succeeded]).find_each(batch_size: 100) do |charge|
      charge.update_column(:paid_on, charge.updated_at)
    end
  end

  desc "Update membership status and valid at"
  task :update_membership_status_and_valid_at => :environment do |t|
    User.find_each(batch_size: 100) do |user|
      if user.current_membership_charge.present? && user.current_membership_charge.succeeded?
        user.membership_status = :paid
        user.membership_valid_until = user.current_membership_charge.paid_on + 1.year
        user.save!
      end
    end
  end

  desc "Demo data boat's location for sbs-app"
  task :demo_app_boat_location => :environment do |t|
    dock_boats = Boat.where(status: :dock).limit(2)
    if dock_boats[0].present?
      dock_boats[0].update_attributes({
        latitude: 47.647673,
        longitude: -122.342783
      })
    end
    if dock_boats[1].present?
      dock_boats[1].update_attributes({
        latitude: 47.647745,
        longitude: -122.344070
      })
    end

    in_use_boats = Boat.where(status: :in_use).limit(3)
    if in_use_boats[1].present?
      in_use_boats[1].update_attributes({
        latitude: 47.644666,
        longitude: -122.340809
      })
    end
    if in_use_boats[2].present?
      in_use_boats[2].update_attributes({
        latitude: 47.648323,
        longitude: -122.351387
      })
    end
    if in_use_boats[3].present?
      in_use_boats[3].update_attributes({
        latitude: 47.642714,
        longitude: -122.337140
      })
    end
  end

  # Correct data for [877 - 2 bookings per day]
  desc "Update departure_time_in_sec that caculated from bookings.departure_time for query optimization"
  task :update_departure_time_in_sec => :environment do |t|
    Booking.find_each(batch_size: 100) do |booking|
      next if booking.departure_time.blank? || booking.departure_time_in_sec != 0
      departure_time_with_date = Time.zone.parse(booking.departure_time)
      departure_time_in_sec = (departure_time_with_date - Time.zone.now.beginning_of_day).to_i / 60
      booking.update_column(:departure_time_in_sec, departure_time_in_sec)
    end
  end

  desc "Migrate email template to settings"
  task :email_templates => :environment do
    Setting.email_booking_confirmation_notification_subject = "Booking Confirmation"
    Setting.email_booking_confirmation_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Just confirming your recent booking with Seattle Boat Share, details of the booking are below:</p>
      <ul>
        <li>Please note you will be charged for the fuel used on the day you complete your booking. If there are any other required charges such as damage, cleaning or missing equipment these will also be charged on the day of your booking being completed.</li>
      </ul>
      <p>BOOKING DETAILS:</p>
      <p>
        {{booking_confirmation_details}}
      </p>
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_booking_reminder_subject = "Upcoming Booking Reminder"
    Setting.email_booking_reminder = <<~HTML
      <p>Hi {{user_first_name}},</p>
      <p>This is just a friendly reminder from Seattle Boat Share of your upcoming booking. Details of your booking are below, if you have any questions please don't hesitate to contact us.</p>
      <p>Booking Detail:</p>
      <p>{{booking_details}}</p>
      <p>{{redflag}}</p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_booking_completed_notification_subject = "Booking Completed"
    Setting.email_booking_completed_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Just letting you know that your recent booking with Seattle Boat Share has been completed, this includes all final charges. Please see below for all booking details.</p>
      <p>Thank you for enjoying the services of Seattle Boat Share, we value our members experience and we hope you had a great time on the water.</p>
      <p>We really value our members and your experience, please take the time to let others know about your great experience and write a review on Yelp or Google. Simply click one of the links below.</p>
      
      {{yelp_review_url}}
      
      <p>BOOKING DETAILS:</p>
      <p>
        {{booking_completed_details}}
      </p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_new_charge_notification_subject = "New Charge Notification"
    Setting.email_new_charge_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Just confirming that a charge has been applied to your Seattle Boat Share Account, please see details of this charge below:</p>
      <p>
        {{charge_details}}
      </p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_deposit_returned_notification_subject = "New Charge Notification"
    Setting.email_deposit_returned_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Just letting you know we have processed your request to have your security deposit returned. Please see details below:</p>
      <p>
        Amount: {{returned_amount}}
        <br>
        Date: {{returned_time}}
        <br>
        Payment Method: {{returned_method}}
      </p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_user_welcome_email_subject = "Welcome to Seattle Boat Share"
    Setting.email_user_welcome_email = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Welcome to Seattle Boat Share we look forward to getting you out on the water.
        If you are just looking to book a lesson and keep in touch you can use this free membership account to book lessons with Seattle Boat Share.</p>
      <p>If you are considering one of our great Sharepass options it is a simple process to get you started:</p>
      <ol>
        <li>Select the type of Sharepass you want.</li>
        <li>Pay for your membership fees.</li>
        <li>Contact Seattle Boat Share and organise a time to visit us so we can finalize the paperwork and qualify you to select a boat and start booking your time on the water.</li>
      </ol>
      <p>Please note you will need to have your security deposit paid, Washington boating license and drivers license validated by Seattle Boat Share before we can you let take a boat out on the water.</p>
      
      <p>We look forward to seeing you.<br>
      From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_membership_waitlist_approved_notification_subject = "Congratulation! Your membership is now available"
    Setting.email_membership_waitlist_approved_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Good news! Your membership is now available and ready to be activated.</p>
      <p>Please login <a href="{{login_url}}">HERE</a> to get started</p>
      <p>As promised your initial deposit has been discounted from your membership.</p>
      <p>Please feel free to contact us if you have any questions.</p>
      
      <p>Thanks<br>
      From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_group_invitation_notification_subject = "Group Invitation"
    Setting.email_group_invitation_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Welcome to Seattle Boat Share, you have been invited by {{sender_full_name}} to join their Seattle Boat Share Group Pass.
        All you need to do is click below to join the group:</p>
      <p><a href={{join_group_url}}>Join Group</a></p>
      <p>If you would like more information about the Seattle Boat Share Group Share Pass please <a href="http://seattleboatshare.com/">click here</a> to view all our membership options.</p>
      <p>Once you join you will need to complete the following steps before you can start booking boats:</p>
      <ol>
        <li>Select the type of Sharepass you want.</li>
        <li>Pay for your membership fees.</li>
        <li>Contact Seattle Boat Share and organise a time to visit us so we can finalize the paperwork and qualify you to select a boat and start booking your time on the water.</li>
      </ol>
      <p>Please note you will need to have your security deposit paid, Washington boating license and drivers license validated by Seattle Boat Share before we can you let take a boat out on the water.</p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML

    Setting.email_new_lesson_notification_subject = "New Lesson Booking"
    Setting.email_new_lesson_notification = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Just confirming your recent booking of a boating lesson with Seattle Boat Share. We look forward to seeing you and getting out on the water.
        We will contact you shortly to confirm your desired date. Details of your booking are below:</p>
      <p>
        Member Name: {{user_full_name}}
        <br>
        Member Phone: {{user_phone}}
        <br>
        Member Email: {{user_email}}
        <br>
        Lesson Type: {{lesson_name}}
        <br>
        Preferred Date: {{date}}
      </p>
      
      <p>We look forward to seeing you.<br>
        From The Team at Seattle Boat Share</p>
    HTML
  end


  # Default setting for reserve_time_for_waitlist
  desc "Default setting for reserve_time_for_waitlist"
  task :set_default_for_reserve_time_for_waitlist => :environment do |t|
    Setting.reserve_time_for_waitlist = 30
    Setting.email_reserve_boat_class_for_waitlist_subject = "Your Boat Class now available for reservation!"
    Setting.email_reserve_boat_class_for_waitlist = <<~HTML
      <p>Hi {{user_first_name}}</p>
      <p>Good news! {{boat_class_name}} Boat Class is now available and ready to book on {{date}}.</p>
      <p>Please login <a href="{{login_url}}">HERE</a> to get started</p>
      
      <p>Thanks<br>
      From The Team at Seattle Boat Share</p>
    HTML
  end

  # Default setting for message on auto fee + cancel fee
  desc "Default setting for message on auto fee + cancel fee"
  task :set_default_for_message_auto_fee_cancel => :environment do |t|
    Setting.cancellation_policy = ''
    Setting.no_show_cancel_fee_unlimited_msg = 'NO SHOW + CANCEL FEE - UNLIMITED'
    Setting.cancel_fee_unlimited_msg = 'CANCEL FEE - UNLIMITED'
    Setting.no_show_fee_msg = 'NO SHOW FEE'
  end
end
