class FirebaseAdminService
  def sync_num_of_service_request
    firebase = init_firebase
    num_of_service_request = ServiceRequest.where(resolved: false).count
    key = ENV["GOOGLE_FIREBASE_DATABASE_ADMIN_KEY"]
    firebase.set("#{key}/numOfServiceRequest", num_of_service_request)
  end

  def sync_num_of_sos
    firebase = init_firebase
    num_of_sos = Sos.where(resolved: false).count
    key = ENV["GOOGLE_FIREBASE_DATABASE_ADMIN_KEY"]
    firebase.set("#{key}/numOfSos", num_of_sos)
  end

  private

  def init_firebase
    base_uri = ENV["google_firebase_url"]
    Firebase::Client.new(base_uri)
  end
end
