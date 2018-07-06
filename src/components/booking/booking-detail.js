import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Button, PanelContainer, Panel, PanelBody, PanelFooter } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import Util from "../../common/util";
import client from "../../common/http-client";
import BookingCancelModal from "../_core/booking/booking-cancel-modal";
import BoatShareUserRedFlag from "../_core/boat-share-user-red-flag";
import BoatShareUserDetail from "../_core/boat-share-user-detail";
import BookingGeneral from "../_core/booking/booking-general";
import BookingCharge from "../_core/booking/booking-charge";
import BookingNote from "../_core/booking/booking-note";
import AddonDetail from "../_core/booking/addon/addon-detail";
import BoatDetail from "./boat-detail";
import BookingTransaction from "./booking-transaction";

@inject("store", "newBookingStore")
@observer
export default class BookingDetail extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      booking: {
        user_notes: "",
        user: {},
        boat: {},
        boat_class: {},
        charges: []
      },
      start_booking_admin_override: false,
      settings: {
        pending_charge_message: ""
      },

      submitDisabled: false
    };
  }

  componentDidMount() {
    this.loadBookingDetail();
    client.get(`${URL_CONFIG.settings_path}`).then(res => {
      var newState = this.state;
      newState.settings.pending_charge_message = res.pending_charge_message;
      this.setState(newState);
    });
  }

  loadBookingDetail() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.bookings_path}/${id}`).then(res => {
      var newState = this.state;
      newState.booking = res;
      if (!newState.booking.user_notes) {
        newState.booking.user_notes = "";
      }
      newState.booking.start_date = moment(newState.booking.start_date);
      newState.booking.end_date = moment(newState.booking.end_date);
      this.setState(newState);
      this.props.store.updateBooking(res);
      // TODO: Populate to newBookingStore inorder to make add-on component work
      // Later on, should merge those two stores
      this.props.newBookingStore.populate(res, "view");
    });
  }

  setSubmitDisable(value) {
    this.setState({ submitDisabled: value });
  }

  onCancelBookingFn() {
    this.confirmCancelModal.wrappedInstance.open();
  }

  resolvedCancelBookingFn() {
    this.componentDidMount();
  }

  onUpdateBoat(selectedBoat, booking) {
    let newState = this.state;
    newState.booking.boat = selectedBoat;
    newState.booking.status = booking.status;
    newState.booking.system_notes = booking.system_notes;
    newState.booking = Object.assign({}, newState.booking);
    this.props.store.updateBooking(newState.booking);
    this.setState(newState);
  }

  onUpdateAddons(booking_addons) {
    this.props.newBookingStore.updateBookingAddons(booking_addons);
    this.refreshCharges();
  }

  onGoToBookingStartFn() {
    const { booking, start_booking_admin_override } = this.state;
    const { booking_type } = booking;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;

    let bookingIsNotToday =
      moment()
        .startOf("day")
        .diff(booking.start_date, "days") !== 0;
    if (bookingIsNotToday && window.env === "production") {
      Util.growlError("cannot_start_booking_not_today");
      return;
    }

    if (!isAdminLessonBooking && this.boatShareUserRedFlag.hasRedFlag(start_booking_admin_override)) {
      Util.growlError("red_flag_should_complete");
      return;
    }

    if (!booking.boat) {
      Util.growlError("boat_should_assign");
      return;
    }

    if (booking.boat.status === "yard" || booking.boat.status === "need_attention") {
      Util.growlError("The assigned boat is in YARD or NEED ATTENTION, please check again please!");
      return;
    }

    let bookingCharge =
      booking.charges.find(charge => {
        return charge.charge_type === CONSTANT.CHARGE_TYPE.booking.key;
      }) || {};

    if (
      !isAdminLessonBooking &&
      bookingCharge.status !== CONSTANT.CHARGE_STATUS.succeeded &&
      bookingCharge.status !== CONSTANT.CHARGE_STATUS.pending
    ) {
      Util.growlError("booking_payment_should_finish");
      return;
    }

    let { id } = this.props.params;
    this.props.router.push(`${URL_CONFIG.bookings_path}/${id}/start`);
  }

  onGoToCheckInBoat() {
    let { id } = this.props.params;
    this.props.router.push(`${URL_CONFIG.bookings_path}/${id}/check_in_boat`);
  }

  onGoToComplete() {
    let { id } = this.props.params;
    this.props.router.push(`${URL_CONFIG.bookings_path}/${id}/complete`);
  }

  openViewImages() {
    let { id } = this.props.params;
    this.props.router.push(`${URL_CONFIG.bookings_path}/${id}/view_images`);
  }

  handleChangeUserNote(user_notes) {
    this.state.booking.user_notes = user_notes;
  }

  handleChangeBookingCharges(charges) {
    let newState = this.state;
    this.state.booking.charges = charges;
    this.setState(newState);
    this.refreshAddons();
  }

  refreshAddons() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.admin_booking_addons_path}/find_by_booking`, { booking_id: id }).then(res => {
      this.props.newBookingStore.updateBookingAddons(res);
    });
  }

  refreshCharges() {
    let { id } = this.props.params;

    //TODO: Refactor by query charge list only
    client.get(`${URL_CONFIG.bookings_path}/${id}`).then(res => {
      if (res && res.charges && res.charges.length > 0) {
        var newState = this.state;
        newState.booking.charges = res.charges;
        this.setState(newState);
      }
    });
  }

  render() {
    const { booking, start_booking_admin_override } = this.state;
    const { user_side } = this.props;
    const is_admin = user_role == CONSTANT.MAIN_ROLE.admin;
    const isStartBookingScreen =
      booking.status == CONSTANT.BOOKING_STATUS.confirmed || booking.status == CONSTANT.BOOKING_STATUS.tba;

    const { red_flags, booking_type } = booking;
    const redFlagShow = is_admin && red_flags && red_flags.length > 0;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    return (
      <PanelContainer noOverflow className="payment-form">
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col sm={6}>
                  <h3>Booking Detail</h3>
                </Col>
                <Col sm={6} className="text-right">
                  <Button lg outlined bsStyle="primary" onClick={::this.openViewImages}>
                    View Images
                  </Button>{" "}
                </Col>
              </Row>
              {/* For booking in tba or confirmed. Need to get red_flag from user */}
              {isStartBookingScreen && (
                <Row>
                  <Col md={12}>
                    <BoatShareUserRedFlag ref={c => (this.boatShareUserRedFlag = c)} fetch_data user={booking.user} />
                  </Col>
                </Row>
              )}
              {/* For booking in other status. red_flag already store within booking's model */}
              {!isStartBookingScreen &&
                redFlagShow && (
                  <Row>
                    <Col md={12}>
                      <BoatShareUserRedFlag
                        red_flags={red_flags}
                        ref={c => (this.boatShareUserRedFlag = c)}
                        user={booking.user}
                      />
                    </Col>
                  </Row>
                )}
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Member Details</h4>
                </Col>
                <BoatShareUserDetail user={booking.user} />
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Boat</h4>
                </Col>
                <BoatDetail
                  onUpdateBoat={::this.onUpdateBoat}
                  booking={booking}
                  boat_class={booking.boat_class}
                  boat={booking.boat}
                />
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Extras</h4>
                </Col>
                <AddonDetail
                  booking_addons={booking.booking_addons}
                  onUpdateAddons={::this.onUpdateAddons}
                  booking={booking}
                  user_side={user_side}
                />
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Detail</h4>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <BookingGeneral user={booking.user} booking={booking} />
                </Col>
              </Row>
              {!isAdminLessonBooking && (
                <div>
                  <Row>
                    <Col md={12}>
                      <h4 className="section-form-title">Charges</h4>
                    </Col>
                  </Row>
                  <BookingCharge
                    booking={booking}
                    pending_charge_message={this.state.settings.pending_charge_message}
                    refreshCharges={::this.refreshCharges}
                    handleChangeBookingCharges={::this.handleChangeBookingCharges}
                  />
                </div>
              )}
              <BookingNote booking={booking} handleChangeUserNote={::this.handleChangeUserNote} />
              {!isAdminLessonBooking && <BookingTransaction transactions={booking.transactions} />}
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12}>
                  <br />
                  {isStartBookingScreen && (
                    <label className="text-right">
                      <small>
                        Admin Override: No permission restrictions?
                        <input
                          name="is_admin_override"
                          checked={start_booking_admin_override}
                          onChange={::this.handleStartBookingAdminOverride}
                          type="checkbox"
                        />
                      </small>
                    </label>
                  )}
                  <div>
                    {(() => {
                      if (
                        booking.status == CONSTANT.BOOKING_STATUS.tba ||
                        booking.status == CONSTANT.BOOKING_STATUS.confirmed
                      ) {
                        return (
                          <Button outlined bsStyle="danger" onClick={::this.onCancelBookingFn}>
                            Cancel Booking
                          </Button>
                        );
                      }
                    })()}{" "}
                    {isStartBookingScreen && (
                      <span>
                        <Button outlined bsStyle="primary" onClick={::this.onGoToBookingStartFn}>
                          Start Booking
                        </Button>{" "}
                      </span>
                    )}
                    {(() => {
                      if (
                        booking.status == CONSTANT.BOOKING_STATUS.in_use ||
                        booking.status == CONSTANT.BOOKING_STATUS.processing
                      ) {
                        return (
                          <span>
                            <Button
                              outlined
                              bsStyle="primary"
                              onClick={::this.onGoToCheckInBoat}
                              disabled={this.state.submitDisabled}
                            >
                              Check in Boat
                            </Button>
                          </span>
                        );
                      }
                    })()}
                    {(() => {
                      if (booking.status == CONSTANT.BOOKING_STATUS.checked_in && is_admin) {
                        return (
                          <span>
                            <Button
                              outlined
                              bsStyle="primary"
                              onClick={::this.onGoToComplete}
                              disabled={this.state.submitDisabled}
                            >
                              Complete Booking
                            </Button>
                          </span>
                        );
                      }
                    })()}
                    <BookingCancelModal
                      ref={c => (this.confirmCancelModal = c)}
                      booking={booking}
                      resolvedFn={::this.resolvedCancelBookingFn}
                    />
                  </div>
                  <br />
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }

  handleStartBookingAdminOverride(e) {
    const start_booking_admin_override = e.target.checked;
    this.setState({ start_booking_admin_override });
  }
}
