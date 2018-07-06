import React from "react";

import { Button, Modal, Form, FormGroup, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";

import Loader from "react-loader";

export default class StripeMicrodepositModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.state = {
      okDisabled: false,
      loaded: true,
      firstDeposit: "",
      secondDeposit: ""
    };
  }

  setLoading(isLoading) {
    this.setState({
      okDisabled: isLoading,
      loaded: !isLoading
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  handleChangeFirstDeposit(e) {
    var newState = this.state;
    newState.firstDeposit = e.target.value;
    this.setState(newState);
  }

  handleChangeSecondDeposit(e) {
    var newState = this.state;
    newState.secondDeposit = e.target.value;
    this.setState(newState);
  }

  onClickOK() {
    this.props.resolvedFn(this.state.firstDeposit, this.state.secondDeposit);
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Microdeposit amounts in cents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Form horizontal className={this.state.loaded ? "" : "is-loading"}>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                First deposit
              </Col>
              <Col sm={9}>
                <FormControl
                  type="number"
                  autoFocus
                  value={this.state.firstDeposit}
                  onChange={::this.handleChangeFirstDeposit}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Second deposit
              </Col>
              <Col sm={9}>
                <FormControl
                  type="number"
                  value={this.state.secondDeposit}
                  onChange={::this.handleChangeSecondDeposit}
                />
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.onClickOK} bsStyle="primary" disabled={this.state.okDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
