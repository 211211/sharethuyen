import { isNil } from "lodash/lang";
import { CONSTANT } from "../common/config.js";

class BookingUtil {
  static isBlockoutDate(booking_settings, date, boat_class) {
    let isBlock = false;
    const { block_out_rules } = booking_settings;
    if (!isNil(block_out_rules)) {
      block_out_rules.forEach(rule => {
        if (
          rule.kind == "all" ||
          (rule.kind == "boat_class" &&
            !isNil(boat_class) &&
            !isNil(boat_class.id) &&
            parseInt(rule.boat_class_id) == boat_class.id)
        ) {
          rule.dates.forEach(ruleDate => {
            if (ruleDate == date.format(CONSTANT.DATE_FORMAT)) {
              isBlock = true;
            }
          });
        }
      });
    }
    return isBlock;
  }

  static isBookingMissDeadline(booking_settings, date, boat_class) {
    let result = {
      isBlock: false
    };
    const { booking_rules } = booking_settings;
    if (!isNil(booking_rules)) {
      booking_rules.forEach(rule => {
        const start_date = moment(rule.start_date);
        const end_date = moment(rule.end_date);
        const deadline_date = moment(rule.deadline_date);
        if (date > start_date && date < end_date && moment() > deadline_date) {
          result.isBlock = true;
          result.deadline_date = rule.deadline_date;
        }
      });
    }
    return result;
  }
}

export default BookingUtil;
