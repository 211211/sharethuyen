class RenderEmailContent
  include ActionView::Helpers::NumberHelper

  def initialize(setting_key, vars = {})
    @raw_content = Setting[setting_key].presence || ""
    @vars = vars
  end

  def perform
    parse_template
  end

  private

  def parse_template
    result = @raw_content
    @vars.each do |field, value|
      html = process_value(field, value)
      result.gsub!("{{#{field}}}", html.to_s)
    end
    result.gsub!(/\{\{\.w+\}\}/, '')
    result
  end

  def process_value(field, value)
    case field.to_sym
      when :booking_confirmation_details
        booking_confirmation_details(value)
      when :booking_details
        booking_confirmation_details(value)
      when :redflag
        redflag(value)
      when :booking_completed_details
        booking_completed_details(value)
      when :yelp_review_url
        yelp_review_url(value)
      when :charge_details
        charge_details(value)
      else
        value
    end
  end

  def booking_confirmation_details(booking)
    return "" unless booking.is_a?(Booking)

    <<~HTML
      <p>
        Booking ID: #{booking.id}
        <br>
        Boat Class: #{booking.boat_class.name}
        <br>
        Days: #{(booking.end_date.to_date - booking.start_date.to_date).to_i + 1}
        <br>
        Departure Time: #{booking.departure_time}
        <br>
        Start & End Date: #{booking.start_date} - #{booking.end_date}
        <br>
        Amount: #{number_to_currency(booking.booking_amount)}
        <br>
        WA Sale tax: #{number_to_currency(booking.booking_amount_of_tax)}
        <br>
        Total: #{number_to_currency(booking.booking_amount_after_tax)}
      </p>
    HTML
  end

  def booking_completed_details(booking)
    return "" unless booking.is_a?(Booking)

    <<~HTML
      <p>
        Booking ID: #{booking.id}
        <br>
        Boat Class: #{booking.boat_class.name}
        <br>
        Start & End Date: #{booking.start_date} - #{booking.end_date}
        <br>
        Scheduled Departure Time: #{booking.departure_time}
        <br>
        Actual Departure Time: #{booking.start_booking_at}
        <br>
        Return Time: #{booking.check_in_boat_at}
      </p>
    HTML
  end

  def redflag(redflag)
    return "" if redflag.blank?

    <<~HTML
      <p>Don't forget before you take your booking you will need to complete and validate the following items with #{Setting.site_name}:<p>
      <p>
        #{ redflag.has_key?(:need_security_deposit) ? "Security Deposit <br>" : "" }
        #{ redflag.has_key?(:need_wa_state_marine_photo) ? "WA Boat license <br>" : "" }
        #{ redflag.has_key?(:need_driver_license_photo) ? "Drivers License <br>" : "" }
      </p>
    HTML
  end

  def yelp_review_url(value)
    <<~HTML
        #{ value ? "<p>We really value our members and your experience, please take the time to let others know about your great experience and write a review on Yelp or Google. Simply click one of the links below.</p><a href='#{Setting.yelp_review_url}'><img style='max-width: 100%; height: auto' src='https://members.seattleboatshare.com/assets/yelp.png'></a>" : "" }
    HTML
  end

  def charge_details(charge)
    return "" unless charge.is_a?(Charge)

    <<~HTML
      <p>
        Amount: #{number_to_currency(charge.amount)}
        #{
          charge.discount_percent > 0 ? 
              "<br>Discount percent: #{charge.discount_percent}%<br>After discounted amount: #{number_to_currency(charge.amount_after_discounted)}" : 
              "" 
        }
        <br>
        WA Sale tax: #{number_to_currency(charge.amount_of_tax)}
        <br>
        #{
          charge.waitlist_deduct_amount.present? ? "Waitlist deduct amount: #{number_to_currency(charge.waitlist_deduct_amount)}<br>" : ""
        }
        Total: #{number_to_currency(charge.amount_after_tax)}
        <br>
        Description: #{charge.description}
        <br>
        #{ charge.note.present? ? "Notes: #{charge.note}<br>" : "" }
        Status: #{charge.status.capitalize}
        <br>
        Date: #{charge.main_transaction.try(:created_at) || charge.created_at}
        <br>
        Source: #{charge.source.capitalize}
      </p>
    HTML
  end
end