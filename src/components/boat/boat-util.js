import { CONSTANT } from "../../common/config";

class BoatUtil {
  static mapBoat(boat) {
    return {
      id: boat.id || null,
      name: boat.name || "",
      description: boat.description || "",
      year: boat.year || "",
      length: boat.length || "",
      engine: boat.engine || "",
      engine_hours: boat.engine_hours || "",
      seating: boat.seating || "",
      status: boat.status || "dock",
      bathroom: boat.bathroom || "",
      capacity: boat.capacity || "",
      identifier: boat.identifier || "",
      fuel_consumption: boat.fuel_consumption || "",
      cruising_speed: boat.cruising_speed || "",
      us_coast_guard_capacity: boat.us_coast_guard_capacity || "",
      boat_class_id: boat.boat_class_id || "",
      yard_end_date: boat.yard_end_date ? moment(boat.yard_end_date) : null,
      boat_amenities: boat.boat_amenities || [],
      boat_images: boat.boat_images || [],
      statuses: boat.statuses || [],
      booking_checklist_category_ids: boat.booking_checklist_category_ids || [],
      fuel_meter_enabled: boat.fuel_meter_enabled || false,
      fuel_meter: boat.fuel_meter || 0,
      fuel_rate_of_burn: boat.fuel_rate_of_burn || 0,
      fuel_remain: boat.fuel_remain || 0
    };
  }

  static buildSubmitBoat(boat, boat_images) {
    var formData = new FormData();
    formData.append("boat[name]", boat.name.trim());
    formData.append("boat[description]", boat.description.trim());
    formData.append("boat[year]", boat.year);
    formData.append("boat[length]", boat.length);
    formData.append("boat[status]", boat.status);
    formData.append("boat[engine]", boat.engine);
    formData.append("boat[engine_hours]", boat.engine_hours);
    formData.append("boat[seating]", boat.seating);
    formData.append("boat[bathroom]", boat.bathroom);
    formData.append("boat[capacity]", boat.capacity);
    formData.append("boat[identifier]", boat.identifier);
    formData.append("boat[fuel_consumption]", boat.fuel_consumption);
    formData.append("boat[cruising_speed]", boat.cruising_speed);
    formData.append("boat[us_coast_guard_capacity]", boat.us_coast_guard_capacity);
    formData.append("boat[boat_class_id]", boat.boat_class_id);
    formData.append("boat[fuel_meter_enabled]", boat.fuel_meter_enabled);
    formData.append("boat[fuel_rate_of_burn]", boat.fuel_rate_of_burn);
    if (CONSTANT.BOAT_STATUS[boat.status] == CONSTANT.BOAT_STATUS["yard"]) {
      if (boat.yard_end_date) {
        formData.append("boat[yard_end_date]", boat.yard_end_date.format(CONSTANT.DATE_FORMAT));
      } else {
        formData.append("boat[yard_end_date]", "");
      }
    }

    if (typeof boat.amenity_ids != "undefined" && boat.amenity_ids.length > 0) {
      boat.amenity_ids.map(function(id) {
        formData.append("boat[boat_amenities_boats_attributes][][boat_amenity_id]", id);
      });
    }
    if (typeof boat_images != "undefined" && boat_images.length > 0) {
      boat_images.map(function(boat_image, index) {
        formData.append(`boat[boat_images_attributes][${index}][image_url]`, boat_image.image_url);
        formData.append(`boat[boat_images_attributes][${index}][is_primary]`, boat_image.is_primary);
      });
    }

    if (boat.booking_checklist_category_ids.length == 0) {
      formData.append(`boat[booking_checklist_category_ids][]`, []);
    } else {
      boat.booking_checklist_category_ids.map(function(id, index) {
        formData.append(`boat[booking_checklist_category_ids][]`, id);
      });
    }
    return formData;
  }
}

export default BoatUtil;
