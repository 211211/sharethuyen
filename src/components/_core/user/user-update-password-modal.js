import React from "react";

import { Button, Modal, FormGroup, Row, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";

import Loader from "react-loader";

export default class UserUpdatePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      submitDisabled: false,
      password: "",
      password_confirmation: ""
    };
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

  close() {
    var newState = this.state;
    newState.showModal = false;
    this.setState(newState);
  }

  open() {
    var newState = this.state;
    newState.showModal = true;
    this.setState(newState);
  }

  ok() {
    this.props.resolvedFn(this.state.password, this.state.password_confirmation);
  }

  handleChangePassword(e) {
    var newState = this.state;
    newState.password = e.target.value;
    this.setState(newState);
  }

  handleChangeConfirmPassword(e) {
    var newState = this.state;
    newState.password_confirmation = e.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={::this.close} bsSize="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={this.state.loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Password <span className="req-field">*</span>
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={::this.handleChangePassword}
                  />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Password Confirmation <span className="req-field">*</span>
                </Col>
                <Col sm={9}>
                  <FormControl
                    type="password"
                    placeholder="Confirmation Password"
                    value={this.state.password_confirmation}
                    onChange={::this.handleChangeConfirmPassword}
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
