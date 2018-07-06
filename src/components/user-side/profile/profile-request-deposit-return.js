import React from "react";
import { Link, withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import { CONSTANT } from "../../../common/config";

import { Button, Alert } from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";

@withRouter
@inject("store")
@observer
export default class ProfileRequestDepositReturn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  onClickRequest() {
    const user = this.props.store.user;
    let security_deposit_charge = user.security_deposit_charge;

    this.setState({ isLoading: true });
    client.post(`${URL_CONFIG.user_charges_path}/${security_deposit_charge.id}/request_deposit_return`).then(
      res => {
        util.growl("Your request has been sent. We will contact you shortly!");
        this.props.store.updateUser(res.user);
        this.setState({ isLoading: false });
      },
      response => {
        this.setState({ isLoading: false });
      }
    );
  }

  render() {
    const user = this.props.store.user;

    let security_deposit_charge = user.security_deposit_charge;
    let isUnlimited = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;

    if (
      (user.membership_status !== CONSTANT.MEMBERSHIP_STATUS.EXPIRED && !isUnlimited) ||
      security_deposit_charge.status !== CONSTANT.CHARGE_STATUS.succeeded
    )
      return null;

    let isLoading = this.state.isLoading;

    let content = security_deposit_charge.requested_return ? (
      <Alert bsStyle="warning">You have requested Security Deposit return!</Alert>
    ) : (
      <Button bsStyle="danger" onlyOnHover disabled={isLoading} onClick={!isLoading ? ::this.onClickRequest : null}>
        {isLoading ? "Sending request ..." : "Request Deposit Return"}
      </Button>
    );

    return <div className="text-center">{content}</div>;
  }
}
