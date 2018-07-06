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
  constructor(props) {
    super(props);
    this.state = {
      refundLoading: false
    };
  }
  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  componentWillMount() {
    this.changeBookingDatesReaction = reaction(
      () => [this.booking.start_date, this.booking.end_date],
      () => this.onChangeBookingDatesReaction()
    );
  }

  componentWillUnmount() {
    if (this.changeBookingDatesReaction) {
      this.changeBookingDatesReaction();
      this.changeBookingDatesReaction = null;
    }
  }

  render() {
    const {
      amount_of_booking_after_discounted,
      amount_after_discounted,
      amount_of_tax,
      amount_after_tax,
      amount_of_addon,
      mode,
      refund_amount,
      booking_subtotal_was,
      booking_sale_tax_was,
      booking_total_was,
      addon_subtotal_was,
      addon_sale_tax_was,
      total_was,
      start_date,
      end_date,
      start_date_was,
      end_date_was
    } = this.booking;
    const difference = amount_after_tax - refund_amount;
    const cancellation_fee = booking_total_was - refund_amount;
    const { refundLoading } = this.state;
    const curFormatter = Util.currencyFormatter().format;
    const startDateChanged = start_date && start_date_was && start_date_was.diff(start_date, "days") != 0;
    const endDateChanged = end_date && end_date_was && end_date_was.diff(end_date, "days") != 0;
    const dateChanged = startDateChanged || endDateChanged;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Payment Detail</h4>
        </Col>
        <Col md={12}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: 600,
                margin: "auto"
              }}
            >
              <Form horizontal className="booking-detail">
                <PaymentFormGroup label="Original Booking Subtotal" amount={booking_subtotal_was} />
                <PaymentFormGroup label="Original WA sales tax" amount={booking_sale_tax_was} />
                <PaymentFormGroup label="Original Total" amount={booking_total_was} />
                {dateChanged && <PaymentFormGroup label="Original Cancellation Fee" amount={cancellation_fee} />}
                <PaymentFormGroup label="Original Add-Ons" amount={addon_subtotal_was} />
                <PaymentFormGroup label="Original Add-Ons WA Sales Tax" amount={addon_sale_tax_was} />
                <PaymentFormGroup label="Original Booking + Add Ons Total" amount={total_was} />
                {dateChanged && (
                  <div>
                    <FormGroup controlId="staticControl">
                      <Col sm={6} componentClass={ControlLabel}>
                        Refunded Original Booking
                      </Col>
                      <Col sm={6}>
                        <FormControl.Static>
                          {refundLoading && (
                            <Loader lines={10} length={15} radius={20} top="12px" left="40px" scale={0.3} />
                          )}
                          {!refundLoading && curFormatter(refund_amount)}
                        </FormControl.Static>
                      </Col>
                    </FormGroup>
                    <PaymentFormGroup label="New Subtotal" amount={amount_after_discounted} />
                    <PaymentFormGroup label="New WA Sales Tax" amount={amount_of_tax} />
                    <PaymentFormGroup label="Difference *" amount={difference} />
                  </div>
                )}
              </Form>
            </div>
          </div>
          {dateChanged && (
            <div style={{ textAlign: "right" }}>
              <small>* If difference is (-), it will be credited to user balance.</small>
            </div>
          )}
        </Col>
      </Row>
    );
  }

  onChangeBookingDatesReaction() {
    const { id, start_date, end_date, start_date_was, end_date_was, mode } = this.booking;
    if (mode !== "edit") return;
    if (!id || !start_date || !end_date) return;
    this.setState({
      refundLoading: true
    });

    const calculate_refund_amount_url = `${URL_CONFIG.bookings_path}/${id}/calculate_refund_amount/`;
    client
      .get(calculate_refund_amount_url, {
        new_start_date: start_date.format(CONSTANT.DATE_FORMAT),
        new_end_date: end_date.format(CONSTANT.DATE_FORMAT)
      })
      .then(
        res => {
          this.setState({
            refundLoading: false
          });
          this.booking.refund_amount = res.refund;
        },
        res => {
          this.setState({
            refundLoading: false
          });
          this.booking.refund_amount = 0;
        }
      );
  }
}

class PaymentFormGroup extends React.Component {
  render() {
    const curFormatter = Util.currencyFormatter().format;
    const { label, amount } = this.props;
    return (
      <FormGroup controlId="staticControl">
        <Col sm={6} componentClass={ControlLabel}>
          {label}
        </Col>
        <Col sm={6}>
          <FormControl.Static>{curFormatter(amount)}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }
}
