class BoatAssignableService
  def initialize(boat_class_id, start_date, end_date)
    @boat_class_id = boat_class_id
    @start_date = start_date
    @end_date = end_date
  end

  def perform
    all_boats_in_class = Boat.where(
      boat_class_id: @boat_class_id
    ).not_in_yard.not_in_use.order_by_status

    assigned_boats_in_class = BoatsAssignedBetweenByClassService.new(@boat_class_id, @start_date, @end_date).perform
    available_in_class = all_boats_in_class - assigned_boats_in_class
    assigned_boats_all_classes = Boat.assigned_boats_between(@start_date, @end_date)
    available_boats_other_classes = Boat.where.not(boat_class_id: nil).not_in_yard.not_in_use.order_by_status - assigned_boats_all_classes - available_in_class

    {
      boats: available_in_class,
      boats_other_classes: available_boats_other_classes
    }
  end
end
