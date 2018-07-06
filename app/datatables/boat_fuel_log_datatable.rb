class BoatFuelLogDatatable < Datatable
  delegate :params, to: :@view

  def initialize(view)
    @view = view
  end

  def as_json(options = {})
    {
      echo: params[:sEcho].to_i,
      recordsTotal: BoatFuelLog.count,
      recordsFiltered: boat_fuel_logs.total_entries,
      data: data
    }
  end

private

  def data
    boat_fuel_logs.map do |fuel_log|
      changes = ''
      fuel_before = fuel_log.fuel_before.to_i
      fuel_after = fuel_log.fuel_after.to_i
      if fuel_log.usage?
        if fuel_log.fuel_meter_enabled
          changes = "-#{fuel_log.meter_after - fuel_log.meter_before} gallons"
        else
          changes = "-#{fuel_before - fuel_after} x 1/16th"
        end
      elsif fuel_log.fill_up?
        changes = "+#{fuel_after - fuel_before} x 1/16th"
      elsif fuel_log.edit_fuel?
        changes = "from #{fuel_before} x 1/16th to #{fuel_after} x 1/16th"
      end
      [
        fuel_log.id,
        fuel_log.boat_id,
        fuel_log.booking_id,
        fuel_log.charge_id,
        fuel_log.log_type,
        changes,
        fuel_log.note,
        fuel_log.created_at.to_s
      ]
    end
  end

  def boat_fuel_logs
    @boat_fuel_logs ||= fetch_boat_fuel_logs
  end

  def fetch_boat_fuel_logs
    boat_id = params["columns"]["1"]["search"]["value"]
    boat_fuel_logs = BoatFuelLog.ransack({
      boat_id_eq: boat_id
    })
    boat_fuel_logs.sorts = "#{sort_column} #{sort_direction}"
    boat_fuel_logs.result.page(page).per_page(per_page)
  end

  def sort_column
    columns = %w[id name icon]
    if ((params["order"].present?) &&
        (params["order"]["0"].present?) &&
        (params["order"]["0"]["column"].present?))
      columns[params[:order]['0'][:column].to_i]
    else
      "id"
    end
  end
end
