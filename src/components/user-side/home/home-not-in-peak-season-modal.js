import React from "react";
import { Link } from "react-router";

import { Button, Modal } from "@sketchpixy/rubix";

import { URL_CONFIG, MESSAGES } from "../../../common/config";

export default class HomeNotInPeakSeasonModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>GOOD NEWS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{MESSAGES.happy_hour_all_day_mid_season}</p>
          <p>
            <Link to={`${URL_CONFIG.user_bookings_path}/new`}>Click here</Link> to start your booking
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
