import React from "react";

import { Button, Modal, FormGroup, Row, Radio, Col, ControlLabel, FormControl } from "@sketchpixy/rubix";

import BoatShareAddress from "../boat-share-address";
import UserBillingAddressForm from "../user-billing-address/user-billing-address-form";
import UserUtil from "../../user/user-util";
import Loader from "react-loader";

export default class CardLinkAddressModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      address_id: props.address_id,
      isLoading: false,
      billingMode: "link",
      billing_address: UserUtil.mapBillingAddressState({})
    };
  }

  setLoading(isLoading) {
    var newState = this.state;
    newState.isLoading = isLoading;
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
    this.props.resolvedFn(this.state.address_id, this.state.billingMode, this.state.billing_address);
  }

  onChangeAddress(e) {
    var newState = this.state;
    newState.address_id = e.target.value;
    this.setState(newState);
  }

  switchBillingMode() {
    let { billingMode } = this.state;
    if (billingMode == "link") {
      this.setState({ billingMode: "add" });
    } else {
      this.setState({ billingMode: "link" });
    }
  }

  handleBillingAddressFieldChange(fieldName, value) {
    let { billing_address } = this.state;
    billing_address[fieldName] = value;
    this.setState({
      billing_address: billing_address
    });
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Choose A Billing Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={!this.state.isLoading} />
          <Row className="form-horizontal">
            <Col md={12} className={this.state.isLoading ? "is-loading" : ""}>
              {(() => {
                if (this.state.billingMode == "link") {
                  return (
                    <FormGroup>
                      <Col md={12}>
                        {this.props.addresses.map(address => {
                          return (
                            <Radio
                              defaultValue={address.id}
                              key={address.id}
                              onChange={::this.onChangeAddress}
                              checked={this.state.address_id == address.id}
                              name="address-radio-options"
                            >
                              <BoatShareAddress address={address} />
                            </Radio>
                          );
                        })}
                      </Col>
                    </FormGroup>
                  );
                } else {
                  return (
                    <UserBillingAddressForm
                      ref={c => (this.userBillingAddressForm = c)}
                      billing_address={this.state.billing_address}
                      handleBillingAddressFieldChange={::this.handleBillingAddressFieldChange}
                    />
                  );
                }
              })()}
            </Col>
            <Col md={12}>
              <Button outlined bsStyle="info" onClick={::this.switchBillingMode}>
                {(() => {
                  if (this.state.billingMode == "link") {
                    return "Add New";
                  } else {
                    return "Back to list";
                  }
                })()}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.ok} bsStyle="primary">
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
