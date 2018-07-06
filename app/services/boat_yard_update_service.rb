class BoatYardUpdateService
  def initialize(boat, boat_params, current_date)
    @boat = boat
    @boat_params = boat_params
    @current_date = current_date
  end

  def perform
    yard_end_date = @boat_params[:yard_end_date]
    end_date = yard_end_date.present? ? Date.parse(yard_end_date) : nil
    if !@boat.yard? && @boat_params[:status].to_sym == :yard
      create_log(end_date)
    elsif @boat_params[:status].to_sym != :yard && @boat.yard?
      # Boat is not in yard anymore
      end_date = @current_date - 1.day
      last_log = BoatYardLog.where(boat_id: @boat.id).order(id: :asc).last
      if last_log.present?
        if last_log.start_date <= end_date
          last_log.update_attribute(:end_date, end_date)
        else
          last_log.destroy
        end
      end
    elsif end_date != @boat.yard_end_date
      last_log = BoatYardLog.where(boat_id: @boat.id).order(id: :asc).last
      last_log.update_attribute(:end_date, end_date) if last_log.present?
    end
    true
  end

  private

  # Avoid data duplication by clean BoatYardLog with
  # start_date or end_date in [now, @boat_params[:yard_end_date]]
  def clean_overlap_yard_log(exclude_log)
    BoatYardLog.ransack(
      id_not_eq: exclude_log.id,
      boat_id_eq: @boat.id,
      g: [{
        start_date_or_end_date_in: @current_date..@current_date,
        end_date_present: 0,
        m: "or"
      }]
    ).result.destroy_all
  end

  def create_log(end_date)
    created_log = BoatYardLog.create!(
      boat: @boat,
      start_date: @current_date,
      end_date: end_date
    )
    clean_overlap_yard_log(created_log)
  end
end
