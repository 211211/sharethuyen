import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl, Image } from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";

export default class EditFuelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      fuel_log: {
        amount: 1,
        note: "",
        log_type: "edit_fuel"
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
      fuel_log: {
        amount: 1,
        note: "",
        log_type: "edit_fuel"
      }
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  ok() {
    let { fuel_log } = this.state;
    const { bookingId, boatId } = this.props;
    fuel_log.booking_id = bookingId;
    fuel_log.boat_id = boatId;
    fuel_log.fuel_before = this.props.fuel_remain;
    fuel_log.fuel_after = fuel_log.amount;
    this.setState({
      submitDisabled: true
    });

    this.setState({
      loaded: false
    });

    client
      .post(`${URL_CONFIG.boat_fuel_logs_edit_fuel_path}`, {
        boat_fuel_log: fuel_log
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

  handleChangeAmount(e) {
    var newState = this.state;
    newState.fuel_log.amount = parseInt(e.target.value);
    this.setState(newState);
  }

  handleChangeNote(e) {
    var newState = this.state;
    newState.fuel_log.note = e.target.value;
    this.setState(newState);
  }

  render() {
    const { state } = this;
    const { showModal, loaded, fuel_log } = state;
    const { fuel_remain } = this.props;
    let newFuelRemains = [];
    for (let i = 0; i <= 16; i++) {
      newFuelRemains.push(i);
    }
    return (
      <Modal show={showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Fuel</Modal.Title>
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
                  New Remain Fuel
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    value={fuel_log.amount}
                    onChange={::this.handleChangeAmount}
                  >
                    {newFuelRemains.map((amount, index) => {
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
                    value={fuel_log.note}
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
