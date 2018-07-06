import React from "react";

import { Row, Col, Radio, FormGroup, FormControl, ControlLabel } from "@sketchpixy/rubix";
import Loader from "react-loader";
import Toggle from "react-toggle";
import { isEmpty, isEqual, isNull } from "lodash/lang";

import client from "../../common/http-client";
import Util from "../../common/util";
import { URL_CONFIG } from "../../common/config";
import PaymentCardDetail from "../_core/payment/payment-card-detail";
import PaymentBankAccountDetail from "../_core/payment/payment-bank-account-detail";

export default class BookingSecurityDeposit extends React.Component {
  constructor(props) {
    super(props);

    let booking = props.booking;

    this.state = {
      cards: null,
      security_deposit: booking.security_deposit,
      security_deposit_amount: booking.security_deposit_amount,
      security_deposit_stripe_token: null
    };
  }

  componentDidMount() {
    this.requestCards(this.props.booking);
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(nextProps.booking, this.props.booking)) return;

    this.setState({
      security_deposit: nextProps.booking.security_deposit,
      security_deposit_amount: nextProps.booking.security_deposit_amount
    });
    this.requestCards(nextProps.booking);
  }

  requestCards(booking) {
    let user = booking.user;
    if (user && user.id) {
      client.get(`${URL_CONFIG.get_card_path}/${user.id}`).then(
        res => {
          let cards = [];
          if (res && res.sources && res.sources.length > 0) {
            cards = res.sources;
          }

          this.setState({
            cards: cards
          });
        },
        error => {
          this.setState({
            cards: []
          });
        }
      );
    }
  }

  isValid() {
    if (isEmpty(this.state.cards) || !this.state.security_deposit) return true;

    if (isEmpty(this.state.security_deposit_amount) || this.state.security_deposit_amount === "0") {
      Util.growlError("Booking Security Deposit Amount is not valid");
      return false;
    }

    if (isNull(this.state.security_deposit_stripe_token)) {
      Util.growlError("You have to select an card to for Booking Security Deposit");
      return false;
    }

    return true;
  }

  getValues() {
    if (isEmpty(this.state.cards) || !this.state.security_deposit) return {};

    return {
      security_deposit: true,
      security_deposit_amount: this.state.security_deposit_amount,
      security_deposit_stripe_token: this.state.security_deposit_stripe_token
    };
  }

  handleFieldsChanged(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  render() {
    let { cards } = this.state;
    let loaded = !isNull(cards);

    let userNoCardTpl = isEqual(cards, []) && (
      <Row>
        <Col md={12} className="text-center">
          This user hasn't added any cards, so this feature will be disabled
        </Col>
      </Row>
    );

    let securityDepositEnabledTpl = this.state.security_deposit && (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Security Deposit Amount
          </Col>
          <Col sm={9}>
            <label>
              <FormControl
                type="number"
                name="security_deposit_amount"
                value={this.state.security_deposit_amount}
                onChange={::this.handleFieldsChanged}
              />
            </label>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Stripe Cards:
          </Col>
          <Col sm={9}>
            {loaded &&
              cards.map(card => {
                return (
                  <Radio
                    defaultValue={card.id}
                    key={card.id}
                    name="security_deposit_stripe_token"
                    onChange={::this.handleFieldsChanged}
                    checked={this.state.security_deposit_stripe_token === card.id}
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
          </Col>
        </FormGroup>
      </div>
    );

    let mainTpl = !isEmpty(cards) && (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Enable for this booking?
          </Col>
          <Col sm={9}>
            <label>
              <Toggle
                name="security_deposit"
                checked={this.state.security_deposit}
                onChange={::this.handleFieldsChanged}
              />
            </label>
          </Col>
        </FormGroup>
        {securityDepositEnabledTpl}
      </div>
    );

    return (
      <div
        className={
          loaded ? "form-horizontal booking-security-deposit" : "booking-security-deposit form-horizontal is-loading"
        }
      >
        <Loader loaded={loaded} />
        {userNoCardTpl}
        {mainTpl}
      </div>
    );
  }
}
