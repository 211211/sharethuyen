import React from "react";

import { Row, Col, Form, FormGroup, ControlLabel, FormControl } from "@sketchpixy/rubix";
import { computed, reaction } from "mobx";
import { inject, observer } from "mobx-react";
import Loader from "react-loader";
import Util from "../../../../common/util";
import { URL_CONFIG, CONSTANT } from "../../../../common/config";
import client from "../../../../common/http-client";

@inject("store", "newBookingStore")
@observer
export default class PaymentDetail extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  render() {
    const {
      amount_of_booking_after_discounted,
      amount_after_discounted,
      amount_of_tax,
      amount_after_tax,
      amount_of_addon,
      refund_amount
    } = this.booking;
    const curFormatter = Util.currencyFormatter().format;
    const hintTpl =
      amount_of_addon > 0 ? (
        <span>
          (Booking: {curFormatter(amount_of_booking_after_discounted)}, Addon: {curFormatter(amount_of_addon)})
        </span>
      ) : null;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Payment Detail</h4>
        </Col>
        <Col md={6} mdPush={3}>
          <Form horizontal className="booking-detail">
            <FormGroup controlId="staticControl">
              <Col sm={3} componentClass={ControlLabel}>
                Subtotal
              </Col>
              <Col sm={9}>
                <FormControl.Static>
                  {curFormatter(amount_after_discounted)} {hintTpl}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup controlId="staticControl">
              <Col sm={3} componentClass={ControlLabel}>
                WA Sales Tax
              </Col>
              <Col sm={9}>
                <FormControl.Static>{curFormatter(amount_of_tax)}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup controlId="staticControl">
              <Col sm={3} componentClass={ControlLabel}>
                Total
              </Col>
              <Col sm={9}>
                <FormControl.Static>{curFormatter(amount_after_tax)}</FormControl.Static>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}
