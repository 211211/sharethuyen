class LocationUpdateService
  def initialize(boat_id, latitude, longitude, location_updated_at)
    @boat_id = boat_id
    @latitude = latitude
    @longitude = longitude
    @location_updated_at = location_updated_at
  end

  def perform
    boat_params = {
      latitude: @latitude,
      longitude: @longitude,
      location_updated_at: @location_updated_at
    }
    boat = Boat.find @boat_id
    boat.update!(boat_params)
    
    inuse_booking = Booking.find_by(
      boat_id: @boat_id,
      status: :in_use
    )
    if inuse_booking.present?
      sync_firebase(inuse_booking, boat) 
    else
      raise "There is not in_use booking for Boat ##{@boat_id}"
    end
  end

  private

  def sync_firebase(booking, boat)
    firebase = init_firebase
    booking_location = {
      booking_id: booking.id,
      boat_id: boat.id,
      boat_name: boat.name,
      latitude: boat.latitude,
      longitude: boat.longitude,
      location_updated_at: boat.location_updated_at.iso8601
    }
    key = ENV["GOOGLE_FIREBASE_DATABASE_ADMIN_KEY"]
    firebase_bookings = firebase.get("#{key}/bookings").body
    if firebase_bookings.nil?
      # Firebase key haven't initialized yet
      firebase.set("#{key}/bookings", [booking_location])
    end

    if firebase_bookings.present? && firebase_bookings.length > 0
      found_booking = firebase_bookings.find { |booking| booking["booking_id"] == booking_location[:booking_id] }
      if found_booking.present?
        found_booking[:boat_id] = booking_location[:boat_id]
        found_booking[:boat_name] = booking_location[:boat_name]
        found_booking[:latitude] = booking_location[:latitude]
        found_booking[:longitude] = booking_location[:longitude]
        found_booking[:location_updated_at] = booking_location[:location_updated_at]
      else
        firebase_bookings << booking_location
      end
      firebase.set("#{key}/bookings", firebase_bookings)
    else
      # Firebase key haven't initialized yet
      firebase.set("#{key}/bookings", [booking_location])
    end
  end

  def init_firebase
    base_uri = ENV["google_firebase_url"]
    Firebase::Client.new(base_uri)
  end
end
