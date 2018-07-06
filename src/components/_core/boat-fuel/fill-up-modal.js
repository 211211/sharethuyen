import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl, Image } from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";

export default class FillUpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      fill_up_data: {
        amount: 1,
        note: "",
        log_type: "fill_up"
      },
      submitDisabled: false
    };
  }

  setSubmitDisable(value) {
    this.setState({ submitDisabled: value });
  }

  open() {
    this.setState({
      showModal: true,
      fill_up_data: {
        amount: 1,
        note: "",
        log_type: "fill_up"
      }
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  ok() {
    let { fill_up_data } = this.state;
    const { bookingId, boatId } = this.props;
    fill_up_data.booking_id = bookingId;
    fill_up_data.boat_id = boatId;
    fill_up_data.fuel_before = this.props.fuel_remain;
    fill_up_data.fuel_after = this.props.fuel_remain + fill_up_data.amount;
    this.setState({
      submitDisabled: true
    });

    if (fill_up_data.fuel_before >= CONSTANT.MAX_TANK_SIZE) {
      util.growlError("fuel_tank_is_full");
      return;
    }

    this.setState({
      loaded: false
    });

    client
      .post(`${URL_CONFIG.boat_fuel_logs_fill_up_path}`, {
        boat_fuel_log: fill_up_data
      })
      .then(
        response => {
          this.setState({
            loaded: true,
            submitDisabled: false,
            showModal: false
          });
          this.props.fuelUpdateSuccess();
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
    newState.fill_up_data.amount = parseInt(e.target.value);
    this.setState(newState);
  }

  handleChangeNote(e) {
    var newState = this.state;
    newState.fill_up_data.note = e.target.value;
    this.setState(newState);
  }

  render() {
    const { state } = this;
    const { showModal, loaded, fill_up_data } = state;
    const { fuel_remain } = this.props;
    let available_fill_ups = [];
    for (let i = 15; i >= fuel_remain; i--) {
      available_fill_ups.push(16 - i);
    }
    return (
      <Modal show={showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Fill Up Fuel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Remain Fuel
                </Col>
                <Col sm={9}>
                  <FormControl.Static>{fuel_remain} x 1/16th</FormControl.Static>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Fill Up Amount
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    value={fill_up_data.amount}
                    onChange={::this.handleChangeAmount}
                  >
                    {available_fill_ups.map((amount, index) => {
                      return (
                        <option key={index} value={amount}>
                          {" "}
                          {amount}
                        </option>
                      );
                    })}>
                  </FormControl>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Note
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    rows="3"
                    value={fill_up_data.note}
                    onChange={::this.handleChangeNote}
                  />
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
