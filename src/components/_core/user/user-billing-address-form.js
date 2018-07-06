import React from "react";
import ReactDOM from "react-dom";

import { Row, Col, Grid, Form, FormGroup, Alert, Button, FormControl, ControlLabel } from "@sketchpixy/rubix";

import ModalConfirm from "../modal-confirm";
import { COUNTRIES, STATES } from "../../../common/contry-state-list";
import UserUtil from "../../user/user-util";

export default class UserBillingAddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billing_address: UserUtil.mapBillingAddressState(props.billing_address)
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.billing_address = UserUtil.mapBillingAddressState(nextProps.billing_address);
    this.setState(newState);
  }

  onClickRemove() {
    this.confirmDeleteModal.open();
  }

  removeFn() {
    this.props.parent.removeBillingAddress(this.props.index);
    this.confirmDeleteModal.close();
  }

  handleChangeLine1(e) {
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "line1"
      },
      e.target.value
    );
  }

  handleChangeLine2(e) {
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "line2"
      },
      e.target.value
    );
  }

  handleChangeCity(e) {
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "city"
      },
      e.target.value
    );
  }

  handleChangeState(e) {
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "state"
      },
      e.target.value
    );
  }

  handleChangeZip(e) {
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "zip"
      },
      e.target.value
    );
  }

  handleChangeCountry(e) {
    this.states = STATES.filter(state => {
      return state.country == e.target.value;
    });
    this.props.parent.handleFieldChange(
      {
        name: "billing_addresses",
        index: this.props.index,
        field: "country"
      },
      e.target.value
    );
  }

  render() {
    this.countries = COUNTRIES;
    this.states = STATES.filter(state => {
      return state.country == this.state.billing_address.country;
    });
    return (
      <div className="user-billing-address-group">
        <Row>
          <Col sm={12} className="text-right">
            <Button outlined bsStyle="danger" onClick={::this.onClickRemove}>
              Remove
            </Button>{" "}
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <FormGroup>
              <Col sm={6} componentClass={ControlLabel}>
                Address Line 1
              </Col>
              <Col sm={6}>
                <FormControl
                  tabIndex={this.props.fromIndex}
                  type="text"
                  placeholder="Address Line 1"
                  value={this.state.billing_address.line1}
                  onChange={::this.handleChangeLine1}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={6} componentClass={ControlLabel}>
                Address Line 2
              </Col>
              <Col sm={6}>
                <FormControl
                  tabIndex={this.props.fromIndex + 1}
                  type="text"
                  placeholder="Address Line 2"
                  value={this.state.billing_address.line2}
                  onChange={::this.handleChangeLine2}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={6} componentClass={ControlLabel}>
                Zip
              </Col>
              <Col sm={6}>
                <FormControl
                  tabIndex={this.props.fromIndex + 2}
                  type="text"
                  placeholder="Zip"
                  value={this.state.billing_address.zip}
                  onChange={::this.handleChangeZip}
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                Country
              </Col>
              <Col sm={7}>
                <FormControl
                  tabIndex={this.props.fromIndex + 3}
                  componentClass="select"
                  placeholder="Country"
                  value={this.state.billing_address.country}
                  onChange={::this.handleChangeCountry}
                >
                  {this.countries.map((country, index) => {
                    return (
                      <option key={index} value={country.code}>
                        {country.name}
                      </option>
                    );
                  })}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                State
              </Col>
              <Col sm={7}>
                <FormControl
                  tabIndex={this.props.fromIndex + 4}
                  componentClass="select"
                  placeholder="State"
                  value={this.state.billing_address.state}
                  onChange={::this.handleChangeState}
                >
                  {this.states.map((state, index) => {
                    return (
                      <option key={index} value={state.short}>
                        {state.name}
                      </option>
                    );
                  })}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                City
              </Col>
              <Col sm={7}>
                <FormControl
                  tabIndex={this.props.fromIndex + 5}
                  type="text"
                  placeholder="City"
                  value={this.state.billing_address.city}
                  onChange={::this.handleChangeCity}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <ModalConfirm
          message="Do you want to remove this Billing Address?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
      </div>
    );
  }
}
