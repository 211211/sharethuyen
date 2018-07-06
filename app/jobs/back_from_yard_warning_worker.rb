class BackFromYardWarningWorker
  include Sidekiq::Worker

  def perform()
    back_date = Date.today + 3
    warning_boats_query = {
      status_eq: Boat.statuses["yard"],
      yard_end_date_eq: back_date
    }
    boat_models = Boat.ransack(warning_boats_query).result
    boats = boat_models.map do |boat|
      {
        id: boat.id,
        name: boat.name
      }
    end
    if boats.count > 0
      BoatYardWarningMailer.warning_email(boats, back_date.to_s).deliver_later
    end
  end
end
