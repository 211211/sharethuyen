import React from "react";

import { Button, Modal } from "@sketchpixy/rubix";

import Loader from "react-loader";
import client from "../../../common/http-client";
import { withRouter } from "react-router";

class StartNewMembershipChargeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      buttonDisabled: false,
      loaded: true
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.submit = this.submit.bind(this);
  }

  setLoading(isLoading) {
    this.setState({
      buttonDisabled: isLoading,
      loaded: !isLoading
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  submit() {
    let userId = this.props.user.id;
    let isUserSide = this.props.user_side;
    let url = isUserSide
      ? "/profile/start_renewal_membership_charge"
      : `/admin/users/${userId}/start_renewal_membership_charge`;

    this.setLoading(true);
    client
      .post(url, {
        user_id: userId
      })
      .then(
        response => {
          if (isUserSide) {
            this.props.store.updateUser(response.user);
          }
          this.props.router.push(response.redirect);
          this.setLoading(false);
        },
        response => {
          if (response.status === 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            }
          }
          this.setLoading(false);
        }
      );
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Oops!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={this.state.loaded} />
          Looks like you are trying to make a booking beyond the day your current membership expires. Don't worry, if
          you wish to make this booking please renew your membership and save with our early bird special. Simply go to
          your profile membership and renew your membership. If you need help please contact us.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close} bsStyle="default" disabled={this.state.buttonDisabled}>
            No, Thanks
          </Button>
          <Button onClick={this.submit} bsStyle="primary" disabled={this.state.buttonDisabled}>
            Yes, Please
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default withRouter(StartNewMembershipChargeModal, { withRef: true });
