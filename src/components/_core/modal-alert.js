import React from "react";

import { Button, Modal } from "@sketchpixy/rubix";

export default class ModalAlert extends React.Component {
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
          <Modal.Title>Sorry</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.props.message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
