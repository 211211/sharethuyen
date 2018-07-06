import React from "react";

import {
  PanelContainer,
  Panel,
  PanelBody,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl
} from "@sketchpixy/rubix";
import { computed, reaction } from "mobx";
import { inject, observer } from "mobx-react";
import client from "../../../common/http-client";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import UserBoatClass from "../../_core/booking/booking-form/user-boat-class";
import BoatShareBookCalendar from "../../_core/boat-share-book-calendar";
import BookingGeneral from "../../_core/booking/booking-general";
import Discount from "../../_core/booking/booking-form/discount";
import PaymentDetail from "../../_core/booking/booking-form/payment-detail-edit";
import BookingPaymentMethod from "../../_core/booking/booking-payment-method";
import BookingNote from "../../_core/booking/booking-note";
import Footer from "../../_core/booking/booking-form/footer";
import Util from "../../../common/util";
import { isNil } from "lodash/lang";
import StartNewMembershipChargeModal from "../../_core/booking/start-new-membership-charge-modal";

@inject("store", "newBookingStore")
@observer
export default class BookingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDisabled: true,
      booking_settings: {},
      booking_settings_loaded: false,
      booking_addons: []
    };
    this.booking.sale_tax_percent = this.settings.sale_tax_percent;
    this.booking.mode = "edit";
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  componentDidMount() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.bookings_path}/${id}`).then(res => {
      var newState = this.state;
      newState.booking_addons = res.booking_addons;
      this.setState(newState);
      this.booking.populate(res);
      this.bookCalendar.wrappedInstance.requestBookingData(
        this.booking.user.id,
        this.booking.boat_class.id,
        moment(res.start_date).format(CONSTANT.DATE_FORMAT),
        false
      );
    });
    this.getBookingValidate();
  }

  componentWillMount() {
    this.changeSaleTaxPercentReaction = reaction(
      () => [this.settings.sale_tax_percent],
      () => this.onChangeSaleTaxPercentReaction()
    );
    this.changeBookingReaction = reaction(
      () => [this.booking.start_date, this.booking.end_date],
      () => this.checkAndEnableSubmit()
    );
  }

  componentWillUnmount() {
    if (this.changeSaleTaxPercentReaction) {
      this.changeSaleTaxPercentReaction();
      this.changeSaleTaxPercentReaction = null;
    }
    if (this.changeBookingReaction) {
      this.changeBookingReaction();
      this.changeBookingReaction = null;
    }
  }

  render() {
    const { booking } = this;
    const { user, boat_class, amount_after_tax, refund_amount, start_date } = booking;
    const difference = amount_after_tax - refund_amount;
    const { booking_settings, booking_settings_loaded, submitDisabled, booking_addons } = this.state;
    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Edit Booking</h4>
                </Col>
              </Row>
              <UserBoatClass />
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Calendar</h4>
                </Col>
                <Col md={8} mdPush={2}>
                  <BoatShareBookCalendar
                    user={user}
                    booking={booking}
                    user_side={false}
                    booking_settings={booking_settings}
                    booking_settings_loaded={booking_settings_loaded}
                    ref={c => (this.bookCalendar = c)}
                  />
                </Col>
              </Row>
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
                  />
                </Col>
              </Row>
              <PaymentDetail />
              {difference > 0 && (
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Payment Methods</h4>
                  </Col>
                  <Col md={6} mdPush={3}>
                    <BookingPaymentMethod
                      user_side={false}
                      amount={this.booking.amount_after_tax}
                      user={this.booking.user}
                      ref={c => (this.paymentMethods = c)}
                    />
                  </Col>
                </Row>
              )}
              <BookingNote handleChangeUserNote={::this.handleChangeUserNote} booking={this.booking} />
              <Footer submitDisabled={submitDisabled} onSubmitFn={::this.onSubmitFn} />
            </Grid>
          </PanelBody>
        </Panel>
        <StartNewMembershipChargeModal
          user_side={false}
          user={this.booking.user}
          store={this.props.store}
          ref={c => (this.startNewMembershipChargeModal = c)}
        />
      </PanelContainer>
    );
  }

  checkAndEnableSubmit() {
    let { user } = this.booking;
    let bookable = this.isPaidMembership(user) || user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;
    this.setState({ submitDisabled: !bookable });
  }

  isPaidMembership(user) {
    return (
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID &&
      (user.shared_membership_status === null || user.shared_membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID)
    );
  }

  onSubmitFn() {
    if (this.isValidForSubmit()) {
      this.setState({
        submitDisabled: true
      });
      const { booking } = this;
      const { id } = booking;
      client
        .put(`${URL_CONFIG.bookings_path}/${id}`, {
          booking: {
            start_date: booking.start_date.format(CONSTANT.DATE_FORMAT),
            end_date: booking.end_date.format(CONSTANT.DATE_FORMAT),
            payment_methods: this.paymentMethods ? this.paymentMethods.wrappedInstance.getPaymentMethods() : [],
            departure_time: booking.departure_time,
            discount_percent: booking.discount_percent || 0,
            user_notes: booking.user_notes,
            is_admin_override: booking.is_admin_override,
            system_notes: booking.system_notes
          }
        })
        .then(
          res => {
            this.setState({ submitDisabled: false });
            let id = res.id;
            this.props.router.push(`${URL_CONFIG.bookings_path}/${id}`);
            this.props.store.cleanPayment();
          },
          response => {
            this.setState({ submitDisabled: false });
          }
        );
    }
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.bookings_path);
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
  handleChangeUserNote(notes) {
    this.booking.user_notes = notes;
  }

  onChangeSaleTaxPercentReaction() {
    this.booking.sale_tax_percent = parseFloat(this.settings.sale_tax_percent);
  }

  isValidForSubmit() {
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
      this.bookCalendar.wrappedInstance.valid(this.booking.start_date, this.booking.end_date) &&
      this.isDepartureTimeValid() &&
      (!isNil(this.paymentMethods) ? this.paymentMethods.wrappedInstance.valid() : true)
    );
  }

  isDepartureTimeValid() {
    if (!this.booking.departure_time) {
      Util.growlError("need_to_select_departure_time");
      return false;
    }
    return true;
  }
}
