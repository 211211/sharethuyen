import React from "react";
import { inject, observer } from "mobx-react";

import { FormGroup, Row, Radio, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";
import { Link } from "react-router";

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";
import { isNumber } from "lodash";

@inject("store")
@observer
export default class BookingAddChargeFuel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gallon_usage: "",
      gallon_price: ""
    };
  }

  componentDidMount() {
    let settingUrl = this.props.user_side ? `${URL_CONFIG.user_settings_path}` : `${URL_CONFIG.settings_path}`;
    $.getJSON(settingUrl).then(res => {
      let newState = this.state;
      newState.gallon_price = res.gallon_price;
      this.setState(newState);
    });
  }

  computeGallonUsageChargeAmount(remainObj) {
    const booking = this.props.store.booking || {};
    const { boat } = booking;
    const { fuel_meter_enabled, fuel_meter, fuel_remain, fuel_rate_of_burn } = boat || {};
    let { remainInMeter, remainIn1_16th } = remainObj;

    // Since the input received is always string, need parsing data before continue
    if (remainInMeter && remainInMeter.length > 0) {
      remainInMeter = parseInt(remainInMeter);
    }
    if (remainIn1_16th && remainIn1_16th.length > 0) {
      remainIn1_16th = parseInt(remainIn1_16th);
    }

    let gallon_usage = 0;
    if (fuel_meter_enabled) {
      gallon_usage = remainInMeter == "" || remainInMeter < fuel_meter ? 0 : remainInMeter - fuel_meter;
    } else {
      gallon_usage =
        remainIn1_16th == "" || remainIn1_16th < fuel_remain ? (fuel_remain - remainIn1_16th) * fuel_rate_of_burn : 0;
    }

    let amount = gallon_usage * Number.parseFloat(this.state.gallon_price);
    amount = Math.round(amount * 100) / 100;
    return { gallon_usage, amount };
  }

  handleChangeRemainInMeter(e) {
    let newState = this.state;
    const remainInMeter = e.target.value;
    const { gallon_usage, amount } = this.computeGallonUsageChargeAmount({ remainInMeter });
    newState.gallon_usage = gallon_usage;
    this.setState(newState);
    this.props.updateFuelCharge({ remainInMeter, amount });
  }

  handleChangeRemainIn1_16th(e) {
    let newState = this.state;
    const remainIn1_16th = e.target.value;
    const { gallon_usage, amount } = this.computeGallonUsageChargeAmount({ remainIn1_16th });
    newState.gallon_usage = gallon_usage;
    this.setState(newState);
    this.props.updateFuelCharge({ remainIn1_16th, amount });
  }

  render() {
    const booking = this.props.store.booking || {};
    const { boat } = booking;
    const { fuel_meter_enabled, fuel_meter, fuel_remain, fuel_rate_of_burn } = boat || {};
    const { gallon_usage } = this.state;
    const { remainInMeter, remainIn1_16th } = this.props;
    let remainIn1_16ths = [];
    for (let i = 0; i < fuel_remain; i++) {
      remainIn1_16ths.push(i);
    }
    const gallonUsageDisplay = isNumber(gallon_usage) && gallon_usage > 0;
    return (
      <div>
        {fuel_meter_enabled && (
          <div>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Meter before
              </Col>
              <Col sm={6}>
                <FormControl.Static>{fuel_meter}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Meter after
              </Col>
              <Col sm={6}>
                <FormControl
                  type="number"
                  placeholder="Meter after"
                  value={remainInMeter}
                  onChange={::this.handleChangeRemainInMeter}
                />
              </Col>
            </FormGroup>
          </div>
        )}
        {!fuel_meter_enabled && (
          <div>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Fuel before
              </Col>
              <Col sm={6}>
                <FormControl.Static>{fuel_remain}</FormControl.Static>
              </Col>
              <Col sm={3} style={{ paddingTop: 3 }}>
                <em>x 1/16th</em>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Fuel after
              </Col>
              <Col sm={6}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={remainIn1_16th}
                  onChange={::this.handleChangeRemainIn1_16th}
                >
                  {remainIn1_16ths.map((amount, index) => {
                    return (
                      <option key={index} value={amount}>
                        {" "}
                        {amount}
                      </option>
                    );
                  })}>
                </FormControl>
              </Col>
              <Col sm={3} style={{ paddingTop: 3 }}>
                <em>x 1/16th</em>
              </Col>
            </FormGroup>
            {fuel_rate_of_burn == 0 && (
              <FormGroup>
                <Col sm={3} />
                <Col sm={9}>
                  Rate of burn must be configured.
                  <Link to={`${URL_CONFIG.boats_path}/${boat.id}/edit`}> Change here</Link>
                </Col>
              </FormGroup>
            )}
          </div>
        )}
        {gallonUsageDisplay && (
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Num of gallons
            </Col>
            <Col sm={6}>
              <FormControl.Static>{gallon_usage}</FormControl.Static>
            </Col>
            <Col sm={3} style={{ paddingTop: 3 }}>
              <em>x ${this.state.gallon_price}</em>
            </Col>
          </FormGroup>
        )}
      </div>
    );
  }
}
