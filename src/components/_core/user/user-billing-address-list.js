import React from "react";
import ReactDOM from "react-dom";

import { Col, FormGroup, Button } from "@sketchpixy/rubix";

import UserBillingAddressForm from "./user-billing-address-form";

export default class UserBillingAddressList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { billing_addresses } = this.props;
    let addressExist = billing_addresses && typeof billing_addresses.map === "function";

    return (
      <div>
        {addressExist &&
          billing_addresses.map((address, index) => {
            var fromIndex = this.props.fromIndex + index * 6;
            if (!address._destroy) {
              return (
                <UserBillingAddressForm
                  fromIndex={fromIndex}
                  key={index}
                  index={index}
                  billing_address={address}
                  parent={this.props.parent}
                />
              );
            }
          })}

        <div className="user-billing-address-group">
          <FormGroup>
            <Col sm={3} />
            <Col sm={9}>
              <Button outlined bsStyle="info" onClick={this.props.addNewBillingAddress}>
                Add Billing Address
              </Button>
            </Col>
          </FormGroup>
        </div>
      </div>
    );
  }
}
