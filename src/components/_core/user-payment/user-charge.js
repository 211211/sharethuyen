import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Form, FormGroup, Button, FormControl } from "@sketchpixy/rubix";

import AppUtil from "../../../common/util";
import client from "../../../common/http-client";
import { URL_CONFIG, CONSTANT } from "../../../common/config";

import PaymentMethod from "../payment/payment-method";
import PaymentChargeStatus from "../payment/payment-charge-status";
import EditableField from "../editable-field";
import EditableChargeDiscountField from "../editable-charge-discount-field";
import { isNil } from "lodash/lang";

@inject("store")
@observer
export default class UserCharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charge: props.charge,
      submitDisabled: false
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.charge = nextProps.charge;
    this.setState(newState);
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  onClickPayNow() {
    let { charge } = this.props;
    let pay_now_url = `${URL_CONFIG.charges_path}/${charge.id}/pay_now`;
    if (this.props.user_side) {
      pay_now_url = `${URL_CONFIG.user_charges_path}/${charge.id}/pay_now`;
    }
    this.setSubmitDisable(true);
    client.post(pay_now_url).then(
      res => {
        if (res && res.id) {
          this.setState({
            charge: res
          });
        } else if (res && res.charge && res.user) {
          this.setState({
            charge: res
          });
          this.props.store.updateUser(res.user);
        }
        this.setSubmitDisable(false);
      },
      response => {
        this.setSubmitDisable(false);
      }
    );
  }

  requestCharges() {
    let { charge } = this.props;
    let url = `${URL_CONFIG.charges_path}/${charge.id}`;
    client.get(url).then(res => {
      if (res && res.id) {
        this.setState({
          charge: res
        });
      }
    });
  }

  canUpdatePaymentDetail(charge) {
    return charge.status == CONSTANT.CHARGE_STATUS.created || charge.status == CONSTANT.CHARGE_STATUS.failed;
  }

  getWaitListAmount() {
    const { user, charge } = this.props;
    const { current_membership_waitlist } = user;
    const { waitlist_deduct_amount, charge_type } = charge;

    // Caculate charge amount only for membership charge
    if (charge_type != CONSTANT.CHARGE_TYPE.membership.key) {
      return 0;
    }
    let waitlistAmount = 0;
    if (waitlist_deduct_amount && waitlist_deduct_amount > 0) {
      waitlistAmount = waitlist_deduct_amount;
    } else {
      if (
        !isNil(current_membership_waitlist) &&
        (current_membership_waitlist.status == CONSTANT.membershipWaitlistStatus.approved ||
          current_membership_waitlist.status == CONSTANT.membershipWaitlistStatus.requested)
      ) {
        waitlistAmount = current_membership_waitlist.paid_amount;
      }
    }
    return waitlistAmount;
  }

  render() {
    const { charge } = this.state;
    const { payment, user } = this.props.store;
    const { status } = charge;
    const cards = payment.sources;
    const waitlistAmount = this.getWaitListAmount();
    let subTotalAmount;
    let totalAmount;
    if (status != CONSTANT.CHARGE_STATUS.created) {
      // At this time, watilistAmount applied to totalAmount
      totalAmount = charge.amount_after_tax;
      subTotalAmount = totalAmount + waitlistAmount;
    } else {
      // At this time, watilistAmount haven't applied to totalAmount
      subTotalAmount = charge.amount_after_tax;
      totalAmount = subTotalAmount - waitlistAmount;
    }
    if (!charge || !charge.id) {
      return (
        <FormGroup>
          <Col sm={3} />
          <Col sm={9}>
            <p>
              <em>No charge available.</em>
            </p>
          </Col>
        </FormGroup>
      );
    } else {
      let canUpdatePayment = this.canUpdatePaymentDetail(charge);
      return (
        <FormGroup>
          <Row className="hidden-xs">
            <Col xs={4} className="text-center">
              <h4>Payment Method</h4>
            </Col>
            <Col xs={3} className="text-right">
              <h4>Charge</h4>
            </Col>
            <Col xs={2} className="text-center">
              <h4>Status</h4>
            </Col>
            <Col xs={2} />
          </Row>
          <Row className="after-booking-charge-item">
            <Col xs={12} sm={4} className="charge-detail-item">
              <label className="visible-xs-inline-block">Payment Method</label>
              <div className="payment-method">
                <PaymentMethod {...this.props} user_charge charge={charge} cards={cards} user={this.props.user} />
              </div>
            </Col>
            <Col xs={12} sm={3} className="charge-detail-item">
              <label className="visible-xs-inline-block">Charge</label>
              {(() => {
                if (canUpdatePayment && !this.props.user_side) {
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
                        Discount Amount:{" "}
                        <EditableChargeDiscountField
                          discount_type="amount"
                          amount={charge.amount_of_discount}
                          pk={charge.id}
                          requestCharges={::this.requestCharges}
                        />
                        <br />
                      </span>
                      <span>
                        Amount after Discounted: {AppUtil.currencyFormatter().format(charge.amount_after_discounted)}
                        <br />
                      </span>
                      <span>
                        WA Sales Tax: {AppUtil.currencyFormatter().format(charge.amount_of_tax)}
                        <br />
                      </span>
                      <TotalPresentation
                        waitlistAmount={waitlistAmount}
                        subTotalAmount={subTotalAmount}
                        totalAmount={totalAmount}
                      />
                    </div>
                  );
                } else if (charge.discount_percent) {
                  return (
                    <div className="charge">
                      <span>
                        Amount: {AppUtil.currencyFormatter().format(charge.amount)}
                        <br />
                      </span>
                      <span>
                        Discount Percent: {charge.discount_percent}%<br />
                      </span>
                      <span>
                        Amount after Discounted: {AppUtil.currencyFormatter().format(charge.amount_after_discounted)}
                        <br />
                      </span>
                      <span>
                        WA Sales Tax: {AppUtil.currencyFormatter().format(charge.amount_of_tax)}
                        <br />
                      </span>
                      <TotalPresentation
                        waitlistAmount={waitlistAmount}
                        subTotalAmount={subTotalAmount}
                        totalAmount={totalAmount}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="charge">
                      <span>
                        Amount: {AppUtil.currencyFormatter().format(charge.amount)}
                        <br />
                      </span>
                      <span>
                        WA Sales Tax: {AppUtil.currencyFormatter().format(charge.amount_of_tax)}
                        <br />
                      </span>
                      <TotalPresentation
                        waitlistAmount={waitlistAmount}
                        subTotalAmount={subTotalAmount}
                        totalAmount={totalAmount}
                      />
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
            {(() => {
              if (canUpdatePayment) {
                return (
                  <Col xs={12} sm={1} className="charge-detail-item text-right">
                    <Button
                      outlined
                      bsStyle="primary"
                      onClick={::this.onClickPayNow}
                      disabled={this.state.submitDisabled}
                    >
                      Pay Now
                    </Button>
                  </Col>
                );
              }
            })()}
          </Row>
        </FormGroup>
      );
    }
  }
}

class TotalPresentation extends React.Component {
  render() {
    const { waitlistAmount, subTotalAmount, totalAmount } = this.props;
    if (totalAmount == subTotalAmount) {
      return <strong>Total: {AppUtil.currencyFormatter().format(totalAmount)}</strong>;
    }
    return (
      <div>
        <span>
          Sub Total: {AppUtil.currencyFormatter().format(subTotalAmount)}
          <br />
        </span>
        {waitlistAmount > 0 && (
          <span>
            Waitlist Paid Amount: {AppUtil.currencyFormatter().format(waitlistAmount)}
            <br />
          </span>
        )}
        <strong>Total: {AppUtil.currencyFormatter().format(totalAmount)}</strong>
      </div>
    );
  }
}
