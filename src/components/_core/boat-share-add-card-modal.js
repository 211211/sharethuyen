import React from "react";

import { Button, Modal } from "@sketchpixy/rubix";

import StripeCardForm from "./stripe/stripe-card-form";
import StripeBankAccountForm from "./stripe/stripe-bank-account-form";

export default class BoatShareAddCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDisabled: false
    };
  }

  close() {
    this.props.closeModal();
  }

  setSubmitDisable(value) {
    this.setState({
      submitDisabled: value
    });
  }

  resolvedFn() {
    this.addCardForm.wrappedInstance.submitForm();
  }

  render() {
    let modalName = this.props.isBankAccount ? "Add Bank Account" : "Add Card";
    return (
      <Modal show={this.props.show} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modalName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
            if (this.props.isBankAccount) {
              return (
                <StripeBankAccountForm
                  email={this.props.email}
                  setSubmitDisable={::this.setSubmitDisable}
                  closeModal={this.props.closeModal}
                  ref={c => (this.addCardForm = c)}
                />
              );
            } else {
              return (
                <StripeCardForm
                  email={this.props.email}
                  setSubmitDisable={::this.setSubmitDisable}
                  {...this.props}
                  ref={c => (this.addCardForm = c)}
                />
              );
            }
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.resolvedFn} bsStyle="primary" disabled={this.state.submitDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
