import React from "react";
import { computed, reaction } from "mobx";
import { inject, observer } from "mobx-react";
import { isNil } from "lodash/lang";

import { Row, Col, Grid, Form, FormGroup, Button, FormControl, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import BoatShareBookCalendar from "../boat-share-book-calendar";
import SelectBoatClassFormGroup from "../select-boat-class-form-group";
import SelectUserFormGroup from "../select-user-form-group";
import RedFlagMembership from "../red-flag/red-flag-membership";
import BookingGeneral from "./booking-general";
import BookingPaymentMethod from "./booking-payment-method";
import BookingNote from "./booking-note";
import BookingUtil from "../../booking/booking-util";
import AppUtil from "../../../common/util";

import StartNewMembershipChargeModal from "./start-new-membership-charge-modal";
import Footer from "./booking-form/footer";
import Discount from "./booking-form/discount";
import BoatClassAlternatives from "./boat-class-alternatives";
import AddonDetail from "./addon/addon-detail";
import PaymentDetail from "./booking-form/payment-detail";

@inject("store", "newBookingStore")
@observer
export default class BookingAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      submitDisabled: true,
      booking_settings: {},
      booking_settings_loaded: false
    };

    this.booking.reInitialize();

    if (props.current_user) {
      this.booking.user = props.current_user;
    }

    this.booking.sale_tax_percent = this.settings.sale_tax_percent;

    if (props.type === "happy_hour") {
      this.booking.start_date = moment();
      this.booking.end_date = moment();
      this.booking.booking_type = "happy_hour";
    }
  }

  componentDidMount() {
    const { type } = this.props;
    if (type != "happy_hour") {
      this.initBookCalendarWithoutBoatClass();
    }
    this.checkTurnToBookingMode().then(() => {
      this.checkAndEnableSubmit();
      this.getBookingValidate();
    });
  }

  componentWillMount() {
    this.changeUserReaction = reaction(
      () => [this.booking.user],
      () => {
        this.booking.boat_class_prices = [];
      }
    );

    this.changeBoatClassOrUserReaction = reaction(
      () => [this.booking.boat_class, this.booking.user],
      boatClass => this.onChangeBoatClassOrUser()
    );

    this.changeSaleTaxPercentReaction = reaction(
      () => [this.settings.sale_tax_percent],
      boatClass => this.onChangeSaleTaxPercentReaction()
    );
  }

  componentWillUnmount() {
    if (this.changeBoatClassOrUserReaction) {
      this.changeBoatClassOrUserReaction();
      this.changeBoatClassOrUserReaction = null;
    }

    if (this.changeSaleTaxPercentReaction) {
      this.changeSaleTaxPercentReaction();
      this.changeSaleTaxPercentReaction = null;
    }

    if (this.changeUserReaction) {
      this.changeUserReaction();
      this.changeUserReaction = null;
    }
  }

  getBookingValidate() {
    client.get(URL_CONFIG.user_bookings_get_booking_validation_path).then(
      res => {
        this.setState({
          booking_settings: res,
          booking_settings_loaded: true
        });
      },
      function() {
        util.growlError("Cannot load booking validation settings!");
      }
    );
  }

  onChangeSaleTaxPercentReaction() {
    this.booking.sale_tax_percent = parseFloat(this.settings.sale_tax_percent);
  }

  onChangeBoatClassOrUser() {
    this.booking.clearAmountDetail();
    const { user, boat_class } = this.booking;
    const { user_side, type } = this.props;
    const userLoaded = user && user.id;
    if (userLoaded && isNil(boat_class.id) && type != "happy_hour") {
      this.initBookCalendarWithoutBoatClass();
      return;
    }

    if (this.booking.booking_type !== "happy_hour") {
      if (isNil(user.id) || (!user_side && (isNil(boat_class) || isNil(boat_class.id)))) {
        this.bookCalendar.wrappedInstance.initCalendarDummyData();
        return;
      }

      let needReset = true;
      if (this.booking.waitlist_to_booking) {
        needReset = false;
      }

      this.bookCalendar.wrappedInstance.requestBookingData(
        user.id,
        boat_class.id,
        moment().format(CONSTANT.DATE_FORMAT),
        needReset
      );
    } else {
      if (isNil(user.id)) {
        return;
      }

      this.requestHappyHourPrices(user.id, boat_class.id);
    }
  }

  requestHappyHourPrices(user_id, boat_class_id) {
    if (isNil(user_id) || isNil(boat_class_id)) {
      return;
    }

    let happy_hour_price_url = `${URL_CONFIG.bookings_path}/happy_hour_price`;
    if (this.props.user_side) {
      happy_hour_price_url = `${URL_CONFIG.user_bookings_path}/happy_hour_price`;
    }
    client
      .get(happy_hour_price_url, {
        user_id: user_id,
        boat_class_id: boat_class_id
      })
      .then(price => {
        this.booking.addNewAmountDetail("happy_hour", parseFloat(price));
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current_user) {
      this.booking.user = nextProps.current_user;
    }
    this.checkAndEnableSubmit();
  }

  checkAndEnableSubmit() {
    let { user } = this.booking;
    const { current_user, user_side } = this.props;

    // On admin, user is confirmed as default
    let userConfirmed = true;
    if (user_side) {
      userConfirmed = current_user.confirmed;
    }

    let bookable = this.isPaidMembership(user) || user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;
    bookable = bookable && userConfirmed;
    this.setState({ submitDisabled: !bookable });
  }

  onChangeDepartureTime(value) {
    this.booking.departure_time = value;
  }

  setSubmitDisable(value) {
    this.setState({ submitDisabled: value });
  }

  isValidForSubmit() {
    if (this.props.type !== "happy_hour") {
      if (
        this.booking.start_date &&
        this.booking.end_date &&
        this.booking.user.membership_type !== CONSTANT.MEMBERSHIP_TYPE.daily &&
        this.booking.user.membership_type !== CONSTANT.MEMBERSHIP_TYPE.unlimited
      ) {
        let expiryDate = moment(this.booking.user.membership_valid_until, "MM/DD/YYYY");
        if (expiryDate.isBefore(this.booking.start_date) || expiryDate.isBefore(this.booking.end_date)) {
          this.startNewMembershipChargeModal.wrappedInstance.open();
          return;
        }
      }

      return (
        this.selectUser.valid() &&
        this.selectBoatClass.wrappedInstance.valid() &&
        this.bookCalendar.wrappedInstance.valid(this.booking.start_date, this.booking.end_date) &&
        this.isDepartureTimeValid() &&
        this.paymentMethods.wrappedInstance.valid()
      );
    } else {
      return (
        this.selectBoatClass.wrappedInstance.valid() &&
        this.selectUser.valid() &&
        this.isDepartureTimeValid() &&
        this.paymentMethods.wrappedInstance.valid()
      );
    }
  }

  isDepartureTimeValid() {
    if (!this.booking.departure_time) {
      AppUtil.growlError("need_to_select_departure_time");
      return false;
    }

    return true;
  }

  //TODO: This is quick and dirty way to expose internal state for parent component
  getBooking() {
    let booking = this.booking;
    booking.payment_methods = this.paymentMethods.wrappedInstance.getPaymentMethods();
    return booking;
  }

  onChangeUser(user) {
    if (user && user.id) {
      this.booking.user = user;
      if (user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited) {
        this.booking.discount_percent = 100;
      } else {
        this.booking.discount_percent = 0;
      }
      this.booking.clearAmountDetail();
      this.selectBoatClass.wrappedInstance.disableBoatClasses(user.boat_class_ids);
    } else {
      this.booking.user = {};
    }
    this.checkAndEnableSubmit();
  }

  isPaidMembership(user) {
    return (
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID &&
      (user.shared_membership_status === null || user.shared_membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID)
    );
  }

  handleIsAdminOverride(e) {
    this.booking.is_admin_override = e.target.checked;
  }

  handleChangeUserNote(notes) {
    this.booking.user_notes = notes;
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  @computed
  get payment() {
    return this.props.store.payment;
  }

  render() {
    const { booking, props, state, payment } = this;
    const { current_user, user_side } = props;
    const { booking_settings, booking_settings_loaded, submitDisabled } = state;
    let { user, boat_class } = booking;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <h4 className="section-form-title">Add Booking</h4>
          </Col>
        </Row>
        <RedFlagMembership user_side={user_side} current_user={current_user} />
        <Row>
          <Col md={8} mdPush={2}>
            <Form horizontal>
              <SelectUserFormGroup
                user={user}
                current_user={current_user}
                onChangeUser={::this.onChangeUser}
                ref={c => (this.selectUser = c)}
              />
              <SelectBoatClassFormGroup
                user_side={user_side}
                boat_class={this.booking.boat_class}
                current_user={current_user}
                ref={c => (this.selectBoatClass = c)}
              />
            </Form>
          </Col>
        </Row>
        {this.props.type != "happy_hour" && (
          <Row>
            <Col md={12}>
              <h4 className="section-form-title">Booking Calendar</h4>
            </Col>
            <Col md={8} mdPush={2}>
              <BoatShareBookCalendar
                user={user}
                user_side={user_side}
                booking_settings={booking_settings}
                booking_settings_loaded={booking_settings_loaded}
                ref={c => (this.bookCalendar = c)}
              />
              <BoatClassAlternatives booking_settings={booking_settings} />
            </Col>
          </Row>
        )}
        <Row>
          <Col md={12}>
            <h4 className="section-form-title">Booking Detail</h4>
          </Col>
          <Col md={6} mdPush={3}>
            <BookingGeneral
              mode="ADD"
              type={this.props.type}
              booking_settings={booking_settings}
              booking_settings_loaded={booking_settings_loaded}
              onChangeDepartureTime={::this.onChangeDepartureTime}
              booking={this.booking}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h4 className="section-form-title">Booking Extras</h4>
          </Col>
          <AddonDetail user_side={user_side} />
        </Row>
        {!user_side && <Discount />}
        <PaymentDetail />
        <Row>
          <Col md={12}>
            <h4 className="section-form-title">Payment Methods</h4>
          </Col>
          <Col md={6} mdPush={3}>
            <BookingPaymentMethod
              user_side={user_side}
              amount={this.booking.amount_after_tax}
              user={this.booking.user}
              ref={c => (this.paymentMethods = c)}
            />
          </Col>
        </Row>
        <BookingNote handleChangeUserNote={::this.handleChangeUserNote} booking={this.booking} />
        <Footer submitDisabled={submitDisabled} onSubmitFn={this.props.onSubmitFn} user_side={user_side} />
        <StartNewMembershipChargeModal
          user_side={user_side}
          user={this.booking.user}
          store={this.props.store}
          ref={c => (this.startNewMembershipChargeModal = c)}
        />
      </Grid>
    );
  }

  initBookCalendarWithoutBoatClass() {
    // Init the booking calendar, ex. block those dates in the past
    this.bookCalendar.wrappedInstance.requestBookingData(
      this.booking.user.id,
      null,
      moment().format(CONSTANT.DATE_FORMAT)
    );
  }

  checkTurnToBookingMode() {
    const params = AppUtil.getJsonFromUrl();
    if (params.turnToBooking) {
      this.booking.waitlist_to_booking = true;
      const { user_id, boat_class_id, date } = params;
      return Promise.all([
        client.get(`${URL_CONFIG.boat_classes_path}/${boat_class_id}`),
        client.get(`${URL_CONFIG.users_path}/${user_id}`)
      ]).then(
        values => {
          this.booking.boat_class = values[0];
          this.booking.user = values[1];
          this.booking.start_date = moment(date);
          this.booking.end_date = moment(date);
        },
        () => {
          AppUtil.growlError("something_wrong");
        }
      );
    } else {
      return Promise.resolve("Step done");
    }
  }
}
