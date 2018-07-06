import mobx, { observable, action } from "mobx";
import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import _ from "lodash";
import Util from "../common/util";
import { MESSAGES } from "../common/config";

export default class BoatShareStore {
  @observable user;
  @observable settings;

  /**
   * Payment contains card's sources & default_source
   * On user-side, payment used in Billing & Membership Plan
   * On admin-side, payment used in User's Edit page, Admin Lesson Booking
   */
  @observable payment;
  @observable paymentLoading = false;

  /**
   * paymentUser is the user will be charged shortly
   * On user-side, it the logged-in user, normally the same with this.user
   * On admin-side, it is selected from User select box (On New Booking, On New Lesson Booking)
   */
  @observable
  paymentUser = {
    billing_addresses: []
  };

  /**
   * Booking data used in booking detail
   * To re used data across components (Ex, fuel charge need to retrieve booking's boat data)
   */
  @observable booking;

  /**
   * Whether on user_side or admin_side
   */
  @observable user_side = false;

  constructor() {
    this.init();
    this.fetchUserAndSettings();
  }

  init() {
    this.settings = {
      disabled_user_types: [],
      paid_boat_classes: []
    };
    this.user = {
      boat_class_ids: [],
      current_membership_charge: {},
      membership_charges: [],
      security_deposit_charge: {},
      current_membership_waitlist: {},
      user_profile: {},
      red_flag: {},
      balance: 0,
      confirmed: null
    };
    this.payment = {
      sources: [],
      default_source: ""
    };
  }

  fetchUserAndSettings() {
    // TODO: better to get them all in one request only?

    client.get(URL_CONFIG.current_user_path).then(user => {
      this.user = user;
      this.fetchPayment();
      if (user.main_role != CONSTANT.ROLE.admin.name) this.user_side = true;
    });

    client.get(URL_CONFIG.user_settings_path).then(settings => {
      this.settings = settings;
    });
  }

  fetchPayment() {
    this.paymentLoading = true;
    let userId = this.user.id;
    if (this.paymentUser && this.paymentUser.id) {
      userId = this.paymentUser.id;
    }
    client.get(`${URL_CONFIG.get_card_path}/${userId}`).then(
      res => {
        if (res && res.sources && res.sources.length >= 0) {
          this.payment = res;
        } else {
          this.payment = {
            sources: [],
            default_source: ""
          };
        }
        this.paymentLoading = false;
      },
      () => {
        Util.growlError(MESSAGES.failed_to_load_user_cards);
        this.paymentLoading = false;
      }
    );
  }

  cleanPayment() {
    this.paymentUser = {
      billing_addresses: []
    };
    this.payment = {
      sources: [],
      default_source: ""
    };
  }

  @action
  updateUser(user) {
    this.user = user;
  }

  @action
  updatePaymentUser(user) {
    this.paymentUser = user;
  }

  @action
  updateUserBillingAddress(billing_addresses) {
    this.user.billing_addresses = billing_addresses;
  }

  @action
  updateMembershipWaitlist(current_membership_waitlist) {
    this.user.current_membership_waitlist = current_membership_waitlist;
  }

  @action
  updateSettings(settings) {
    this.settings = settings;
  }

  @action
  updateSettingAttribute(attribute, value) {
    this.settings[attribute] = value;
  }

  @action
  updateUserBalance(userBalance) {
    this.user.balance = userBalance;
  }

  @action
  updateBooking(booking) {
    this.booking = booking;
  }

  @action
  updatePayment(payment) {
    this.payment = payment;
  }

  @action
  updatePaymentSources(sources) {
    this.payment.sources = sources;
  }

  @action
  addPaymentCardSource(source) {
    this.payment.sources.push(source);
  }

  removePaymentCardSource(source_id) {
    let { sources } = this.payment;
    const index = _.findIndex(sources, source => {
      return source.id == source_id;
    });
    sources = sources.splice(index, 1);
  }
}
