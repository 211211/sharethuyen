import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl, Image } from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";

export default class ChangeMeterModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      newMeter: 0,
      submitDisabled: false
    };
  }

  setSubmitDisable(value) {
    this.setState({ submitDisabled: value });
  }

  open() {
    this.setState({
      showModal: true,
      newMeter: 0
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  ok() {
    const { newMeter } = this.state;
    const { boatId } = this.props;
    this.setState({
      loaded: false,
      submitDisabled: true
    });

    client
      .post(`${URL_CONFIG.boat_fuel_logs_change_meter_path}`, {
        new_meter: newMeter,
        boat_id: boatId
      })
      .then(
        response => {
          this.setState({
            loaded: true,
            submitDisabled: false,
            showModal: false
          });
          this.props.changeMeterSuccess();
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

  handleChangeMeter(e) {
    this.setState({ newMeter: e.target.value });
  }

  render() {
    const { state } = this;
    const { showModal, loaded, newMeter } = state;
    return (
      <Modal show={showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Meter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Change meter to
                </Col>
                <Col sm={9}>
                  <FormControl value={newMeter} type="number" onChange={::this.handleChangeMeter} />
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
