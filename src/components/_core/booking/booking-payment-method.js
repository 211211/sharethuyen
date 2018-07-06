import React from "react";
import { inject, observer } from "mobx-react/index";
import { Form, FormGroup, Col, Row, Radio, FormControl, ControlLabel, Button } from "@sketchpixy/rubix";

import PaymentCardDetail from "../payment/payment-card-detail";
import PaymentBankAccountDetail from "../payment/payment-bank-account-detail";
import Loader from "react-loader";
import BoatShareAddCardModal from "../boat-share-add-card-modal";

import AppUtil from "../../../common/util";
import client from "../../../common/http-client";
import util from "../../../common/util";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import { isNil } from "lodash/lang";

@inject("store")
@observer
export default class BookingPaymentMethod extends React.Component {
  constructor(props) {
    super(props);

    let isUnlimitted = props.user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;
    let defaultPaymentMethods = isUnlimitted ? ["user_balance"] : [];

    this.state = {
      amount: props.amount,
      user: props.user,
      user_side: props.user_side,
      requireSecondMethod: false,
      paymentMethods: defaultPaymentMethods,
      showAddCardModal: false
    };
  }

  openAddCardModal() {
    this.setState({
      showAddCardModal: true
    });
  }

  closeAddCardModal() {
    this.setState({
      showAddCardModal: false
    });
  }

  componentWillReceiveProps(nextProps) {
    let requireSecondMethod = false;
    let paymentMethods = this.state.paymentMethods;

    if (
      nextProps.user &&
      nextProps.user.id &&
      (isNil(this.state.user) || isNil(this.state.user.id) || nextProps.user.id != this.state.user.id)
    ) {
      this.requestCards(nextProps.user);

      let isUnlimited = nextProps.user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;
      paymentMethods = isUnlimited ? ["user_balance"] : [];
    }

    if (
      (typeof nextProps.user === "undefined" || typeof nextProps.user.id === "undefined") &&
      this.props.store.payment.sources.length > 0
    ) {
      this.props.store.cleanPayment();
    }

    if (paymentMethods.length === 0 && nextProps.user && nextProps.user.balance > 0) {
      // Default to user_balance
      paymentMethods = ["user_balance"];
    }

    if (nextProps.user && nextProps.amount > nextProps.user.balance && paymentMethods[0] === "user_balance") {
      requireSecondMethod = true;
    } else if (paymentMethods.length > 1) {
      paymentMethods.pop();
    }

    this.setState({
      user: nextProps.user,
      amount: nextProps.amount,
      requireSecondMethod: requireSecondMethod,
      paymentMethods: paymentMethods
    });
  }

  componentDidMount() {
    this.requestCards(this.state.user);
  }

  requestCards(user) {
    if (user && user.id) {
      this.props.store.updatePaymentUser(user);
      this.props.store.fetchPayment();
    } else {
      this.props.store.cleanPayment();
    }
  }

  onChangePaymentMethod(e) {
    let requireSecondMethod = false;
    let paymentMethods = this.state.paymentMethods;
    paymentMethods[0] = e.target.value;

    if (e.target.value === "user_balance" && this.state.amount > this.state.user.balance) {
      requireSecondMethod = true;
    } else if (paymentMethods.length > 1) {
      paymentMethods.pop();
    }

    this.setState({
      requireSecondMethod: requireSecondMethod,
      paymentMethods: paymentMethods
    });
  }

  onChangePaymentMethod2(e) {
    let paymentMethods = this.state.paymentMethods;
    paymentMethods[1] = e.target.value;

    this.setState({
      paymentMethods: paymentMethods
    });
  }

  valid() {
    if (this.state.paymentMethods.length <= 0) {
      util.growlError("need_to_select_payment_method");
      return false;
    } else if (this.state.requireSecondMethod && this.state.paymentMethods.length <= 1) {
      util.growlError("need_to_select_2nd_payment_method");
      return false;
    }

    return true;
  }

  getPaymentMethods() {
    return this.state.paymentMethods;
  }

  render() {
    const { user_side } = this.props;
    const { paymentLoading, payment, paymentUser } = this.props.store;

    // TODO: Use sources directly
    const cards = payment.sources;
    const { billing_addresses } = paymentUser;
    let cashTpl = user_side ? (
      ""
    ) : (
      <Radio
        defaultValue="cash"
        checked={this.state.paymentMethods[0] === "cash"}
        onChange={::this.onChangePaymentMethod}
        name="card-radio-options"
      >
        {" "}
        Cash
      </Radio>
    );

    let checkTpl = user_side ? (
      ""
    ) : (
      <Radio
        defaultValue="check"
        checked={this.state.paymentMethods[0] === "check"}
        onChange={::this.onChangePaymentMethod}
        name="card-radio-options"
      >
        {" "}
        Check
      </Radio>
    );

    let cashTpl2 = user_side ? (
      ""
    ) : (
      <Radio defaultValue="cash" onChange={::this.onChangePaymentMethod2} name="card-radio-options-2">
        {" "}
        Cash
      </Radio>
    );

    let checkTpl2 = user_side ? (
      ""
    ) : (
      <Radio defaultValue="check" onChange={::this.onChangePaymentMethod2} name="card-radio-options-2">
        {" "}
        Check
      </Radio>
    );

    let secondMethodTpl = this.state.requireSecondMethod ? (
      <div className="additional-payment-container">
        <div className="additional-payment">
          <span>
            Your account balance is too low for the entire booking fee. Please select the additional payment method
            below to complete the booking:
          </span>
          {cashTpl2}
          {checkTpl2}
          {cards.map(card => {
            return (
              <Radio
                defaultValue={card.id}
                onChange={::this.onChangePaymentMethod2}
                key={card.id}
                name="card-radio-options-2"
              >
                {(() => {
                  if (card.object !== "bank_account") {
                    return <PaymentCardDetail card={card} />;
                  } else {
                    return <PaymentBankAccountDetail card={card} />;
                  }
                })()}
              </Radio>
            );
          })}
        </div>
      </div>
    ) : (
      ""
    );
    let buttonAddCardTpl =
      paymentUser && paymentUser.id && cards.length == 0 ? (
        <div>
          <Button outlined bsStyle="info" onClick={::this.openAddCardModal}>
            + Add Card
          </Button>
          <BoatShareAddCardModal
            show={this.state.showAddCardModal}
            closeModal={::this.closeAddCardModal}
            addresses={billing_addresses}
            email={paymentUser.email}
          />
        </div>
      ) : null;

    const { paymentMethods, amount } = this.state;
    const { balance } = paymentUser;
    const isUnlimited = paymentUser.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;

    return (() => {
      if (paymentUser) {
        return (
          <div>
            <Row className={paymentLoading ? "form-horizontal is-loading" : "form-horizontal"}>
              <Loader loaded={!paymentLoading} />
              <Col md={12}>
                {(balance > 0 || isUnlimited) && (
                  <Radio
                    defaultValue="user_balance"
                    onChange={::this.onChangePaymentMethod}
                    checked={paymentMethods[0] === "user_balance"}
                    disabled={amount <= 0 && !isUnlimited}
                    name="card-radio-options"
                  >
                    User Balance ({AppUtil.currencyFormatter().format(balance)})
                  </Radio>
                )}
                {secondMethodTpl}
                {cashTpl}
                {checkTpl}
                {cards.map(card => {
                  return (
                    <Radio
                      defaultValue={card.id}
                      onChange={::this.onChangePaymentMethod}
                      key={card.id}
                      disabled={amount <= 0}
                      name="card-radio-options"
                    >
                      {(() => {
                        if (card.object !== "bank_account") {
                          return <PaymentCardDetail card={card} />;
                        } else {
                          return <PaymentBankAccountDetail card={card} />;
                        }
                      })()}
                    </Radio>
                  );
                })}
                {balance <= 0 &&
                  !isUnlimited && (
                    <Radio defaultValue="user_balance" disabled={true} name="card-radio-options">
                      User Balance ({AppUtil.currencyFormatter().format(balance)})
                    </Radio>
                  )}

                {buttonAddCardTpl}
              </Col>
            </Row>
          </div>
        );
      } else {
        return null;
      }
    })();
  }
}
