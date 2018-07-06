import { URL_CONFIG, CONSTANT } from "../../common/config";

class BookingUtil {
  static calculateChargableAmount(charges) {
    var chargableAmount = 0;
    if (charges && charges.length > 0) {
      charges.filter(charge => {
        if (charge.status == CONSTANT.CHARGE_STATUS.created || charge.status == CONSTANT.CHARGE_STATUS.failed) {
          chargableAmount += charge.amount_after_tax;
        }
      });
    }
    return chargableAmount;
  }
}

export default BookingUtil;
