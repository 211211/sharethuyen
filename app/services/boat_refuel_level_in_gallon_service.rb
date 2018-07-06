class BoatRefuelLevelInGallonService
  
  def perform
    refuel_level = Setting.refuel_level
    unless refuel_level.present?
      refuel_level = 0.25
    end
    refuel_level.to_f * 16
  end
end