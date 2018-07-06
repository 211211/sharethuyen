import React from "react";
import Select from "react-select";

import { Row, Col, Icon, ControlLabel, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, MESSAGES } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";
import PaymentMethod from "../payment/payment-method";
import PaymentChargeStatus from "../payment/payment-charge-status";
import BookingChargeFuelPending from "./charge/booking-charge-fuel-pending";
import BookingChargeAfterBookingCharges from "./charge/booking-charge-after-booking-charges";

export default class BookingCharge extends React.Component {
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

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  render() {
    const { booking, user_side } = this.props;
    const { charges } = booking;
    let { BOOKING_STATUS } = CONSTANT;
    let { booking_complete } = this.props;
    let bookingCharges = charges.filter(charge => {
      return charge.charge_type == CONSTANT.CHARGE_TYPE.booking.key;
    });
    let otherCharges = charges.filter(charge => {
      return charge.charge_type != CONSTANT.CHARGE_TYPE.booking.key;
    });
    return (
      <div>
        <Row className="hidden-xs">
          <Col xs={2} />
          <Col xs={3} className="text-center">
            <h4>Payment Method</h4>
          </Col>
          <Col xs={3} className="text-right">
            <h4>Charge</h4>
          </Col>
          <Col xs={2} className="text-center">
            <h4>Status</h4>
          </Col>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Col xs={12} sm={2} className="charges-header" componentClass={ControlLabel} style={{ paddingTop: 15 }}>
            <p>Booking Charge</p>
          </Col>
          <Col xs={12} sm={8} className="section-border-top" />
        </Row>
        {bookingCharges.map((bookingCharge, index) => {
          return (
            <Row style={{ marginTop: 15 }} key={index} className="after-booking-charge-item">
              <Col xs={12} sm={3} smOffset={2} className="charge-detail-item">
                <label className="visible-xs-inline-block">Payment Method</label>
                <div className="payment-method">
                  <PaymentMethod
                    charge={bookingCharge}
                    cards={this.state.cards}
                    user={this.props.booking.user}
                    {...this.props}
                  />
                </div>
              </Col>
              <Col xs={12} sm={3} className="charge-detail-item">
                <label className="visible-xs-inline-block">Charge</label>
                <div className="charge">
                  <span>
                    Amount: {util.currencyFormatter().format(bookingCharge.amount)}
                    <br />
                  </span>
                  <span>
                    WA Sales Tax: {util.currencyFormatter().format(bookingCharge.amount_of_tax)}
                    <br />
                  </span>
                  <strong>Total: {util.currencyFormatter().format(bookingCharge.amount_after_tax)}</strong>
                </div>
              </Col>
              <Col xs={12} sm={2} className="charge-detail-item">
                <label className="visible-xs-inline-block">Status</label>
                <div className="status">
                  <PaymentChargeStatus status={bookingCharge.status} />
                </div>
              </Col>
            </Row>
          );
        })}
        {user_side &&
          otherCharges.length == 0 && (
            <div>
              <BookingChargeFuelPending />
              <Row style={{ marginTop: 15 }}>
                <Col xs={3} className="text-right" componentClass={ControlLabel} style={{ paddingTop: 15 }} />
                <Col xs={8} className="alert alert-danger">
                  {this.props.pending_charge_message}
                </Col>
              </Row>
            </div>
          )}
        <BookingChargeAfterBookingCharges
          user_side={this.props.user_side}
          booking={booking}
          handleChangeBookingCharges={::this.props.handleChangeBookingCharges}
          {...this.props}
        />
      </div>
    );
  }
}
