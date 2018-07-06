import React from "react";

import { Button, Modal, Checkbox } from "@sketchpixy/rubix";

import Loader from "react-loader";

export default class ModalConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      okDisabled: false,
      loaded: true,
      showModal: false,
      termAgree: false
    };
    this.onChangeTermAgree = this.onChangeTermAgree.bind(this);
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

  render() {
    const { onChangeTermAgree } = this;
    const { termAgreeCheck } = this.props;
    const { termAgree } = this.state;
    const okDisabled = this.state.okDisabled || (termAgreeCheck && !this.state.termAgree);
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          {this.props.message}
        </Modal.Body>
        <Modal.Footer>
          {termAgreeCheck && (
            <Checkbox checked={termAgree} onChange={onChangeTermAgree} style={{ textAlign: "left", marginTop: 0 }}>
              I agree to this term
            </Checkbox>
          )}
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.props.resolvedFn} bsStyle="primary" disabled={okDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  onChangeTermAgree(e) {
    this.setState({
      termAgree: e.target.checked
    });
  }
}
