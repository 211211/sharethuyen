import React from "react";
import { withRouter } from "react-router";
import { CONSTANT } from "../../../common/config";

import { Button, Alert } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";

@withRouter
export default class UserRequestDepositReturn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      depositCharge: props.depositCharge,
      membershipStatus: props.membershipStatus
    };
  }

  onClickRequest() {
    let depositCharge = this.state.depositCharge;

    this.setState({ isLoading: true });
    client.post(`${URL_CONFIG.charges_path}/${depositCharge.id}/request_deposit_return`).then(
      res => {
        util.growl("You have requested deposit return for this user!");
        this.setState({ isLoading: false, depositCharge: res.charge });
      },
      response => {
        this.setState({ isLoading: false });
      }
    );
  }

  render() {
    let depositCharge = this.state.depositCharge;

    if (depositCharge.status !== CONSTANT.CHARGE_STATUS.succeeded) return null;

    let isLoading = this.state.isLoading;

    let content = depositCharge.requested_return ? (
      <Alert bsStyle="warning">You have requested Security Deposit return!</Alert>
    ) : (
      <Button bsStyle="danger" onlyOnHover disabled={isLoading} onClick={!isLoading ? ::this.onClickRequest : null}>
        {isLoading ? "Sending request ..." : "Request Deposit Return"}
      </Button>
    );

    return <div className="text-center">{content}</div>;
  }
}
