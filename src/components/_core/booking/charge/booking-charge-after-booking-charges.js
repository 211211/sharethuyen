import React from "react";
import Select from "react-select";

import { Row, Col, ControlLabel, Button, Icon } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../../common/config";
import util from "../../../../common/util";
import client from "../../../../common/http-client";
import ModalConfirm from "../../modal-confirm";
import PaymentMethod from "../../payment/payment-method";
import EditableField from "../../editable-field";
import EditableChargeDiscountField from "../../editable-charge-discount-field";
import PaymentChargeStatus from "../../payment/payment-charge-status";

//TODO: Move to _core
import BookingAddChargeModal from "../../../booking/booking-add-charge-modal";
import BookingUtil from "../../../booking/booking-util";

export default class BookingChargeAfterBookingCharges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      submitDisabled: false,
      fetchedCard: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // Need to check if booking was fetched successfully!
    if (nextProps.booking.user.id && !this.state.fetchedCard) {
      this.requestCards(nextProps.booking.user);
    }
  }

  requestCards(user) {
    client.get(`${URL_CONFIG.get_card_path}/${user.id}`).then(res => {
      if (res && res.sources && res.sources.length > 0) {
        this.setState({
          cards: res.sources,
          fetchedCard: true
        });
      }
    });
  }

  openAddChargeModal() {
    this.addChargeModal.wrappedInstance.open();
  }

  requestCharges() {
    client.get(`${URL_CONFIG.charges_path}?booking_id=${this.props.booking.id}`).then(res => {
      var newState = this.state;
      this.setState(newState);
      this.props.handleChangeBookingCharges(res);
    });
  }

  onClickRemove(charge) {
    this.selected_charge = charge;
    this.confirmDeleteModal.open();
  }

  removeFn() {
    this.confirmDeleteModal.setLoading(true);
    let charge_id = this.selected_charge.id;
    client.delete(`${URL_CONFIG.charges_path}/${charge_id}`).then(
      res => {
        util.growl("charge_remove_successfully");
        this.requestCharges();
        this.confirmDeleteModal.setLoading(false);
        this.confirmDeleteModal.close();
      },
      () => {
        this.confirmDeleteModal.setLoading(false);
      }
    );
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  onClickPayNow() {
    let { booking, user_side } = this.props;
    this.setSubmitDisable(true);
    let { id } = booking;
    let url = `${URL_CONFIG.bookings_path}/${id}/pay_now`;
    if (user_side) {
      url = `${URL_CONFIG.user_bookings_path}/${id}/pay_now`;
    }
    client.post(url).then(
      res => {
        this.setSubmitDisable(false);

        this.props.handleChangeBookingCharges(res.booking.charges);
        $.each(res.results, function(index, result) {
          if (result.key == "fail") {
            util.growlError(result.message);
          } else {
            util.growl(result.message);
          }
        });
      },
      response => {
        this.setSubmitDisable(false);
        if (response.status == 400) {
          if (response.responseJSON.hasOwnProperty("errors")) {
            $(document).trigger("ei:showAlert", [response.responseJSON]);
          }
        }
      }
    );
  }

  render() {
    const { booking, user_side } = this.props;
    const { user, charges } = booking;
    let { BOOKING_STATUS } = CONSTANT;
    let { booking_complete } = this.props;
    let { CHARGE_STATUS } = CONSTANT;
    let not_succeeded_pending_charge = charges.find(charge => {
      let { status } = charge;
      return status != CHARGE_STATUS.succeeded && status != CHARGE_STATUS.pending;
    });
    const isAdminAndChargeChargableBookingStatus =
      !user_side &&
      (booking.status == BOOKING_STATUS.confirmed ||
        booking.status == BOOKING_STATUS.in_use ||
        booking.status == BOOKING_STATUS.processing ||
        booking.status == BOOKING_STATUS.checked_in);
    const showAddChargePayNowSection = isAdminAndChargeChargableBookingStatus || not_succeeded_pending_charge;
    const showPayNow = not_succeeded_pending_charge;

    let otherCharges = charges.filter(charge => {
      return (
        charge.charge_type != CONSTANT.CHARGE_TYPE.booking.key &&
        charge.charge_type != CONSTANT.CHARGE_TYPE.auto_fee.key
      );
    });
    let chargableAmount = BookingUtil.calculateChargableAmount(charges);

    // There is no charge to show and no need to add charge
    if (!showAddChargePayNowSection && otherCharges.length == 0) return null;

    return (
      <div>
        <Row style={{ marginTop: 15 }}>
          <Col xs={12} sm={2} className="charges-header" componentClass={ControlLabel} style={{ paddingTop: 15 }}>
            <p>After Booking Charges</p>
          </Col>
          <Col xs={12} sm={8} className="section-border-top" />
        </Row>
        {otherCharges.map(charge => {
          let chargeNotes = charge.note ? (
            <p>
              <small>Notes: {charge.note}</small>
            </p>
          ) : null;

          return (
            <Row style={{ marginTop: 15 }} key={charge.id} className="after-booking-charge-item">
              <Col xs={12} sm={2} style={{ paddingTop: 3 }} className="charge-detail-item">
                <label className="visible-xs-inline-block">Charge type</label>
                <div className="charge-type">
                  <p>
                    <em>{CONSTANT.CHARGE_TYPE[charge.charge_type].text}</em>
                  </p>
                  {chargeNotes}
                </div>
              </Col>

              <Col xs={12} sm={3} className="charge-detail-item">
                <label className="visible-xs-inline-block">Payment Method</label>
                <div className="payment-method">
                  <PaymentMethod charge={charge} cards={this.state.cards} user={user} {...this.props} />
                </div>
              </Col>
              <Col xs={12} sm={3} className="charge-detail-item">
                <label className="visible-xs-inline-block">Charge</label>
                {(() => {
                  if (charge.status == CONSTANT.CHARGE_STATUS.created && booking_complete) {
                    return (
                      <div className="charge">
                        <span>
                          Amount:{" "}
                          <EditableField amount={charge.amount} pk={charge.id} requestCharges={::this.requestCharges} />
                          <br />
                        </span>
                        <span>
                          Discount Percent:{" "}
                          <EditableChargeDiscountField
                            amount={charge.discount_percent}
                            pk={charge.id}
                            requestCharges={::this.requestCharges}
                          />
                          <br />
                        </span>
                        <span>
                          Amount after Discounted: {util.currencyFormatter().format(charge.amount_after_discounted)}
                          <br />
                        </span>
                        <span>
                          WA Sales Tax: {util.currencyFormatter().format(charge.amount_of_tax)}
                          <br />
                        </span>
                        <strong>Total: {util.currencyFormatter().format(charge.amount_after_tax)}</strong>
                      </div>
                    );
                  } else {
                    return (
                      <div className="charge">
                        <span>
                          Amount: {util.currencyFormatter().format(charge.amount_after_discounted)}
                          <br />
                        </span>
                        <span>
                          WA Sales Tax: {util.currencyFormatter().format(charge.amount_of_tax)}
                          <br />
                        </span>
                        <strong>Total: {util.currencyFormatter().format(charge.amount_after_tax)}</strong>
                      </div>
                    );
                  }
                })()}
              </Col>
              <Col xs={12} sm={2} className="charge-detail-item">
                <label className="visible-xs-inline-block">Status</label>
                <div className="status">
                  <PaymentChargeStatus status={charge.status} />
                </div>
              </Col>
              {!user_side &&
                charge.status == CONSTANT.CHARGE_STATUS.created && (
                  <Col xs={12} sm={1} className="charge-detail-item">
                    <div className="actions">
                      <Button
                        outlined
                        bsStyle="danger"
                        className="fav-btn"
                        onClick={() => {
                          this.onClickRemove(charge);
                        }}
                      >
                        <Icon glyph="icon-simple-line-icons-close" />
                      </Button>
                    </div>
                  </Col>
                )}
            </Row>
          );
        })}

        {showAddChargePayNowSection && (
          <Row style={{ marginTop: 15 }}>
            <Col xs={4} xsOffset={3} className="section-border-top">
              {!user_side && (
                <Button outlined bsStyle="info" onClick={::this.openAddChargeModal}>
                  Add Charge
                </Button>
              )}{" "}
              {showPayNow && (
                <Button outlined bsStyle="primary" onClick={::this.onClickPayNow} disabled={this.state.submitDisabled}>
                  Pay Now
                </Button>
              )}
            </Col>
            <Col xs={4} className="text-right section-border-top price-lbl">
              <span>Total to be charged today: </span>
              <b>{util.currencyFormatter().format(chargableAmount)}</b>
            </Col>
          </Row>
        )}

        <BookingAddChargeModal
          user={user}
          user_side={user_side}
          booking_id={this.props.booking.id}
          addChargeModalSuccess={::this.requestCharges}
          charges={charges}
          ref={c => (this.addChargeModal = c)}
        />
        <ModalConfirm
          message="Do you want to remove this Charge?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
      </div>
    );
  }
}
