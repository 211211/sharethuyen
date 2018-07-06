import React from "react";
import { inject, observer } from "mobx-react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl, Image } from "@sketchpixy/rubix";
import { isNumber } from "lodash";
import BookingAddChargeFuel from "./booking-add-charge-fuel";
import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import util from "../../common/util";
import client from "../../common/http-client";

@inject("store")
@observer
export default class BookingAddChargeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      charge: {
        charge_type: "fuel",
        note: "",
        amount: ""
      },
      fuel: {
        remainInMeter: "",
        remainIn1_16th: ""
      },
      submitDisabled: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.booking_id) {
      var newState = this.state;
      newState.charge.booking_id = nextProps.booking_id;
      this.setState(newState);
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

  open() {
    var newState = this.state;
    newState.showModal = true;
    newState.charge = {
      charge_type: "fuel",
      booking_id: this.props.booking_id,
      amount: ""
    };
    newState.fuel = {
      remainInMeter: "",
      remainIn1_16th: ""
    };
    this.setState(newState);
  }

  close() {
    var newState = this.state;
    newState.showModal = false;
    this.setState(newState);
  }

  ok() {
    var newState = this.state;
    newState.loaded = false;
    newState.submitDisabled = true;
    this.setState(newState);

    const booking = this.props.store.booking || {};
    const { boat } = booking;
    const fuelParams = {
      boat_id: boat.id,
      fuel_meter: parseInt(this.state.fuel.remainInMeter),
      fuel_remain: parseInt(this.state.fuel.remainIn1_16th)
    };
    const { charge } = this.state;
    const meta = {
      // due to some pending charge, the balance need to re-caculate
      balance: this.getCurrentBalance()
    };
    client
      .post(`${URL_CONFIG.charges_path}`, {
        charge,
        fuel: fuelParams,
        meta
      })
      .then(
        response => {
          var newState = this.state;
          newState.loaded = true;
          newState.submitDisabled = false;
          newState.showModal = false;
          this.setState(newState);
          this.props.addChargeModalSuccess();
        },
        response => {
          if (response.status == 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            }
          }
          this.setState({
            loaded: true,
            submitDisabled: false
          });
        }
      );
  }

  handleChangeDescription(e) {
    var newState = this.state;
    newState.charge.note = e.target.value;
    this.setState(newState);
  }

  handleChangeChargeType(e) {
    var newState = this.state;
    newState.charge.charge_type = e.target.value;
    this.setState(newState);
  }

  handleChangeAmount(e) {
    var newState = this.state;
    newState.charge.amount = e.target.value;
    this.setState(newState);
  }

  handleUpdateFuelCharge(fuelObj) {
    let newState = this.state;
    if (typeof fuelObj.remainInMeter !== "undefined") {
      newState.fuel.remainInMeter = fuelObj.remainInMeter;
    }
    if (typeof fuelObj.remainIn1_16th !== "undefined") {
      newState.fuel.remainIn1_16th = fuelObj.remainIn1_16th;
    }
    if (typeof fuelObj.amount !== "undefined") {
      newState.charge.amount = fuelObj.amount;
    }
    this.setState(newState);
  }

  getCurrentBalance() {
    const { user, charges } = this.props;
    let balance = user.balance;
    charges.forEach(charge => {
      if (charge.status == CONSTANT.CHARGE_STATUS.created && charge.source == "user_balance") {
        balance -= charge.amount_after_tax;
      }
    });
    return balance;
  }

  render() {
    const { charge, fuel } = this.state;
    const { user, charges } = this.props;
    const balance = this.getCurrentBalance();

    const { amount, charge_type, note } = charge;
    const booking = this.props.store.booking || {};
    const { boat } = booking;
    const isFuelCharge = charge.charge_type == "fuel";
    const showBalance = isNumber(balance) && balance > 0;
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>New Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={this.state.loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Charge Type
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    value={charge_type}
                    onChange={::this.handleChangeChargeType}
                  >
                    <option value="fuel">Fuel</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="damage">Damage</option>
                    <option value="other">Other</option>
                  </FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Notes <span className="label label-warning">Public</span>
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    rows="3"
                    placeholder="Notes"
                    value={note}
                    onChange={::this.handleChangeDescription}
                  />
                </Col>
              </FormGroup>
              {isFuelCharge && (
                <BookingAddChargeFuel
                  updateFuelCharge={::this.handleUpdateFuelCharge}
                  remainInMeter={this.state.fuel.remainInMeter}
                  remainIn1_16th={this.state.fuel.remainIn1_16th}
                  user_side={this.props.user_side}
                />
              )}
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Amount
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="number"
                    placeholder="Amount"
                    disabled={isFuelCharge}
                    value={amount}
                    onChange={::this.handleChangeAmount}
                  />
                  {showBalance && (
                    <em>
                      User Balance ({util.currencyFormatter().format(balance)})
                      {balance < amount && " is not enough, another charge will be created!"}
                    </em>
                  )}
                </Col>
              </FormGroup>
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
