import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel } from "@sketchpixy/rubix";

import Loader from "react-loader";
import client from "../../../common/http-client";
import { URL_CONFIG } from "../../../common/config";

export default class UserPaymentChangeDefaultCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loaded: true,
      submitDisabled: false,
      source_id: props.default_source
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.source_id = nextProps.default_source;
    this.setState(newState);
  }

  close() {
    var newState = this.state;
    newState.showModal = false;
    newState.source_id = this.props.default_source;
    this.setState(newState);
  }

  open() {
    var newState = this.state;
    newState.showModal = true;
    this.setState(newState);
  }

  ok() {
    var newState = this.state;
    newState.loaded = false;
    newState.submitDisabled = true;
    this.setState(newState);
    client
      .post(`${URL_CONFIG.update_default_source_path}`, {
        email: this.props.email,
        default_source: this.state.source_id
      })
      .then(
        response => {
          var newState = this.state;
          newState.loaded = true;
          newState.submitDisabled = false;
          newState.showModal = false;
          this.setState(newState);
          this.props.resolvedFn(this.state.source_id);
        },
        response => {
          var newState = this.state;
          newState.loaded = true;
          newState.submitDisabled = false;
          this.setState(newState);
        }
      );
  }

  onChangeDefaultCard(e) {
    var newState = this.state;
    newState.source_id = e.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change default card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          <Row className="form-horizontal">
            <Col md={12} className={this.state.loaded ? "" : "is-loading"}>
              <FormGroup>
                <Col md={5} componentClass={ControlLabel}>
                  Default card
                </Col>
                <Col md={7}>
                  {this.props.sources.map(source => {
                    return (
                      <Radio
                        defaultValue={source.id}
                        key={source.id}
                        onChange={::this.onChangeDefaultCard}
                        checked={this.state.source_id == source.id}
                        name="source-radio-options"
                      >
                        ···· {source.last4}
                      </Radio>
                    );
                  })}
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
