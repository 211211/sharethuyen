import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";

import Loader from "react-loader";
import AppUtil from "../../../common/util";
import PaymentCardDetail from "./payment-card-detail";
import PaymentBankAccountDetail from "./payment-bank-account-detail";

export default class PaymentMethodChangeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      card_id: props.charge.stripe_source_id,
      source: props.charge.source,
      initialSource: props.charge.source,
      initialCard: props.charge.stripe_source_id
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.charge) {
      this.setState({
        card_id: nextProps.charge.stripe_source_id,
        source: nextProps.charge.source,
        initialSource: nextProps.charge.source,
        initialCard: nextProps.charge.stripe_source_id
      });
    }
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  setLoaded(loaded) {
    var newState = this.state;
    newState.loaded = loaded;
    this.setState(newState);
  }

  close() {
    var newState = this.state;
    newState.showModal = false;

    //Reset the state
    newState.card_id = this.props.charge.stripe_source_id;
    this.setState(newState);
  }

  open() {
    var newState = this.state;
    newState.showModal = true;
    this.setState(newState);
  }

  ok() {
    if (this.state.source == this.state.initialSource && this.state.card_id == this.state.initialCard) {
      this.close();
      return;
    }
    this.props.resolvedFn(this.state.source, this.state.card_id);
  }

  onChangeCard(e) {
    var newState = this.state;
    newState.source = "stripe";
    newState.card_id = e.target.value;
    this.setState(newState);
  }

  onChangePaymentSource(e) {
    var newState = this.state;
    newState.source = e.target.value;
    newState.card_id = "";
    this.setState(newState);
  }

  render() {
    let { user } = this.props;
    let { charge } = this.props;
    let { user_charge } = this.props;
    let { source } = this.state;
    let charge_amount = charge.amount;
    let msg = "";
    if (source == "user_balance" && charge_amount > user.balance && !user_charge) {
      msg = "User's balance is not enough. Another charge will be created!";
    }
    return (
      <Modal show={this.state.showModal} onHide={::this.close} bsSize="sm" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={this.state.loaded ? "" : "is-loading"}>
              {(() => {
                if (!this.props.user_side) {
                  return (
                    <Radio
                      defaultValue="cash"
                      onChange={::this.onChangePaymentSource}
                      checked={source == "cash"}
                      name="card-radio-options"
                    >
                      Cash
                    </Radio>
                  );
                }
              })()}

              {(() => {
                if (!this.props.user_side) {
                  return (
                    <Radio
                      defaultValue="check"
                      onChange={::this.onChangePaymentSource}
                      checked={source == "check"}
                      name="card-radio-options"
                    >
                      Check
                    </Radio>
                  );
                }
              })()}

              <Radio
                defaultValue="user_balance"
                onChange={::this.onChangePaymentSource}
                disabled={user.balance == 0}
                checked={source == "user_balance"}
                name="card-radio-options"
              >
                User Balance ({AppUtil.currencyFormatter().format(user.balance)})
              </Radio>

              {this.props.cards.map(card => {
                return (
                  <Radio
                    defaultValue={card.id}
                    key={card.id}
                    onChange={::this.onChangeCard}
                    checked={this.state.card_id == card.id}
                    name="card-radio-options"
                  >
                    {(() => {
                      if (card.object != "bank_account") {
                        return <PaymentCardDetail card={card} />;
                      } else {
                        return <PaymentBankAccountDetail card={card} />;
                      }
                    })()}
                  </Radio>
                );
              })}
            </Col>
            <Col md={12}>
              <em>{msg}</em>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.ok} bsStyle="primary" disabled={this.state.submitDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
