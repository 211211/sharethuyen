import { observable, action, extendObservable, autorun, computed } from "mobx";
import { map } from "lodash/collection";
import { sum, sumBy } from "lodash/math";
import { values } from "lodash/object";
import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import { isInteger } from "lodash";

// TODO: Should rename this store to booking-store. To be shared in booking add/edit/view
export default class NewBookingStore {
  @observable id;
  @observable boat_class;
  @observable user;
  @observable booking_type;
  @observable discount_percent;
  @observable amount_detail;
  @observable is_admin_override;
  @observable user_notes;
  @observable start_date;
  @observable end_date;
  @observable sale_tax_percent;
  @observable departure_time;
  @observable system_notes;
  @observable boat_class_prices;
  @observable boat_class_prices_loading;
  @observable charges;
  @observable booking_addons;
  @observable discount_notes;

  // used to track changes in booking edit
  @observable start_date_was;
  @observable end_date_was;
  @observable booking_subtotal_was;
  @observable booking_sale_tax_was;
  @observable booking_total_was;
  @observable addon_subtotal_was;
  @observable addon_sale_tax_was;
  @observable total_was;

  // used to show refund amount when update booking dates
  @observable refund_amount;

  // used to detect the mode of this booking. Either add, view, edit
  @observable mode;

  // boat_class_changed_mode used to detect boat_class changed from either:
  // 1. select `Boat Class` above booking calendar (need reset calendar)
  // 2. or `Alternative Boat Class` below booking calendar (keep choosen dates)
  @observable boat_class_changed_mode;

  // used in booking with only one day
  // need filter out departure time after this return_before
  @observable return_before;

  @observable waitlist_to_booking;

  constructor() {
    this.mode = "new";
    this.sale_tax_percent = 0.0;
    this.refund_amount = 0.0;
    this.booking_type = "normal";
    this.waitlist_to_booking = false;
    this.reInitialize();
  }

  @action
  reInitialize() {
    this.id = undefined;
    this.boat_class = {};
    this.user = {};
    this.booking_type = "normal";
    this.discount_percent = 0;
    this.amount_detail = {};
    this.is_admin_override = false;
    this.user_notes = "";
    this.start_date = "";
    this.end_date = "";
    this.start_date_was = "";
    this.end_date_was = "";
    this.departure_time = "";
    this.system_notes = "";
    this.return_before = "";
    this.boat_class_prices = [];
    this.boat_class_prices_loading = false;
    this.mode = "new";
    this.charges = [];
    this.booking_addons = [];
    this.discount_notes = "";
    this.waitlist_to_booking = false;
  }

  @action
  populate(booking, mode = "edit") {
    this.id = booking.id;
    this.boat_class = booking.boat_class;
    this.user = booking.user;
    this.amount_detail = {};
    this.start_date = moment(booking.start_date);
    this.end_date = moment(booking.end_date);
    this.start_date_was = moment(booking.start_date);
    this.end_date_was = moment(booking.end_date);
    this.departure_time = booking.departure_time;
    this.user_notes = booking.user_notes;
    this.mode = mode;
    this.boat_class_prices = [];
    this.is_admin_override = false;
    this.discount_notes = booking.discount_notes;
    if (booking.charges) {
      this.charges = booking.charges;
    }
    if (booking.booking_addons) {
      this.booking_addons = booking.booking_addons;
    }
    if (mode == "edit") {
      this.calculateEditBooking();
    }
    this.waitlist_to_booking = false;
  }

  calculateEditBooking() {
    this.start_date_was = this.start_date;
    this.end_date_was = this.end_date;
    const chargeBookingSucceededs = this.charges.filter(charge => {
      return (
        charge.status == CONSTANT.CHARGE_STATUS.succeeded && charge.charge_type == CONSTANT.CHARGE_TYPE.booking.key
      );
    });
    this.booking_subtotal_was = sumBy(chargeBookingSucceededs, "amount_after_discounted");
    this.booking_sale_tax_was = sumBy(chargeBookingSucceededs, "amount_of_tax");
    this.booking_total_was = this.booking_subtotal_was + this.booking_sale_tax_was;
    const chargeAddonSucceededs = this.charges.filter(charge => {
      return (
        charge.status == CONSTANT.CHARGE_STATUS.succeeded && charge.charge_type == CONSTANT.CHARGE_TYPE.e_commerce.key
      );
    });
    this.addon_subtotal_was = sumBy(chargeAddonSucceededs, "amount_after_discounted");
    this.addon_sale_tax_was = sumBy(chargeAddonSucceededs, "amount_of_tax");
    this.total_was =
      this.booking_subtotal_was + this.booking_sale_tax_was + this.addon_subtotal_was + this.addon_sale_tax_was;
  }

  updateBookingAddons(booking_addons) {
    this.booking_addons = booking_addons;
  }

  @action
  addNewAmountDetail(date, amount) {
    this.amount_detail = Object.assign({}, this.amount_detail, { [date]: amount });
  }

  @action
  clearAmountDetail() {
    this.amount_detail = {};
  }

  @computed
  get amount() {
    return sum(values(this.amount_detail)) + this.amount_of_addon;
  }

  @computed
  get amount_of_booking() {
    return sum(values(this.amount_detail));
  }

  @computed
  get amount_of_booking_after_discounted() {
    return this.amount_of_booking - (this.amount_of_booking * this.discount_percent) / 100;
  }

  @computed
  get amount_after_discounted() {
    if (this.mode == "edit") {
      return this.amount_of_booking_after_discounted;
    }
    return this.amount_of_booking_after_discounted + this.amount_of_addon;
  }

  @computed
  get discount_amount() {
    return this.amount - this.amount_after_discounted;
  }

  @computed
  get amount_of_tax() {
    return (this.amount_after_discounted * this.sale_tax_percent) / 100;
  }

  @computed
  get amount_after_tax() {
    return this.amount_after_discounted + this.amount_of_tax;
  }

  set discount_amount(amount) {
    this.discount_percent = (amount / this.amount) * 100;
  }

  @computed
  get amount_of_addon() {
    const { booking_addons, start_date, end_date } = this;
    let total = 0;
    if (!moment.isMoment(start_date) || !moment.isMoment(end_date)) return total;
    const numOfDate = this.end_date.diff(this.start_date, "days") + 1;
    booking_addons.forEach(addon => {
      const quantityInStr = addon.quantity;
      const quantity = isInteger(parseInt(quantityInStr)) ? parseInt(quantityInStr) : 0;
      if (addon.price_strategy === "per_booking") {
        total += quantity * addon.price;
      } else {
        total += quantity * addon.price * numOfDate;
      }
    });
    return total;
  }

  loadBoatClassPrices() {
    this.boat_class_prices_loading = true;
    this.boat_class_prices = [];
    client
      .get(`${URL_CONFIG.user_bookings_boat_class_prices_in_days}`, {
        user_id: this.user.id,
        start_date: this.start_date.format(CONSTANT.DATE_FORMAT),
        end_date: this.end_date.format(CONSTANT.DATE_FORMAT)
      })
      .then(
        res => {
          this.boat_class_prices = res;
          this.boat_class_prices_loading = false;
        },
        () => {
          this.boat_class_prices_loading = false;
        }
      );
  }
}
