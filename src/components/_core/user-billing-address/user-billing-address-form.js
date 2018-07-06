import React from "react";
import ReactDOM from "react-dom";

import { Row, Col, Grid, Form, FormGroup, Alert, Button, FormControl, ControlLabel } from "@sketchpixy/rubix";

import { COUNTRIES, STATES } from "../../../common/contry-state-list";
import UserUtil from "../../user/user-util";

export default class UserBillingAddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billing_address: UserUtil.mapBillingAddressState(props.billing_address),
      error_msgs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.billing_address = UserUtil.mapBillingAddressState(nextProps.billing_address);
    this.setState(newState);
  }

  handleChangeLine1(e) {
    this.props.handleBillingAddressFieldChange("line1", e.target.value);
  }

  handleChangeLine2(e) {
    this.props.handleBillingAddressFieldChange("line2", e.target.value);
  }

  handleChangeCity(e) {
    this.props.handleBillingAddressFieldChange("city", e.target.value);
  }

  handleChangeState(e) {
    this.props.handleBillingAddressFieldChange("state", e.target.value);
  }

  handleChangeZip(e) {
    this.props.handleBillingAddressFieldChange("zip", e.target.value);
  }

  handleChangeCountry(e) {
    this.props.handleBillingAddressFieldChange("country", e.target.value);
  }

  isValid() {
    let result = true;
    let { billing_address } = this.state;
    let error_msgs = [];

    function checkRequire(value, fieldName) {
      if (value.length == 0) {
        result = false;
        error_msgs.push(`${fieldName} is required`);
      }
    }
    checkRequire(billing_address.line1, "Address Line 1");
    checkRequire(billing_address.city, "City");
    checkRequire(billing_address.state, "State");
    checkRequire(billing_address.country, "Country");
    this.setState({
      error_msgs: error_msgs
    });
    return result;
  }

  render() {
    this.countries = COUNTRIES;
    this.states = STATES.filter(state => {
      return state.country == this.state.billing_address.country;
    });
    let { error_msgs } = this.state;
    return (
      <Form horizontal>
        <Row>
          <Col md={12}>
            {(() => {
              if (error_msgs.length > 0) {
                return (
                  <Alert danger>
                    <ul>
                      {error_msgs.map((error_msg, i) => {
                        return <li key={i}>{error_msg}</li>;
                      })}
                    </ul>
                  </Alert>
                );
              }
            })()}
            <FormGroup>
              <Col md={4} componentClass={ControlLabel}>
                Address Line 1
              </Col>
              <Col md={7}>
                <FormControl
                  type="text"
                  placeholder="Address Line 1"
                  value={this.state.billing_address.line1}
                  onChange={::this.handleChangeLine1}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={4} componentClass={ControlLabel}>
                Address Line 2
              </Col>
              <Col md={7}>
                <FormControl
                  type="text"
                  placeholder="Address Line 2"
                  value={this.state.billing_address.line2}
                  onChange={::this.handleChangeLine2}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={4} componentClass={ControlLabel}>
                Zip
              </Col>
              <Col md={7}>
                <FormControl
                  type="text"
                  placeholder="Zip"
                  value={this.state.billing_address.zip}
                  onChange={::this.handleChangeZip}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={4} componentClass={ControlLabel}>
                Country
              </Col>
              <Col md={7}>
                <FormControl
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
              <Col md={4} componentClass={ControlLabel}>
                State
              </Col>
              <Col md={7}>
                <FormControl
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
              <Col md={4} componentClass={ControlLabel}>
                City
              </Col>
              <Col md={7}>
                <FormControl
                  type="text"
                  placeholder="City"
                  value={this.state.billing_address.city}
                  onChange={::this.handleChangeCity}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    );
  }
}
