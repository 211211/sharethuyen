import React from "react";
import ReactDOM from "react-dom";
import Toggle from "react-toggle";
import Select from "react-select";
import { inject, observer } from "mobx-react/index";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import AppUtil from "../../common/util";
import client from "../../common/http-client";
import UserPaymentList from "../_core/user-payment/user-payment-list";
import BoatShareImg from "../_core/boat-share-img";
import UserFormCore from "../_core/user/user-form";
import UserBillingAddressList from "../_core/user/user-billing-address-list";
import UserUpdatePasswordModal from "../_core/user/user-update-password-modal";

@inject("store")
@observer
export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      roles: []
    };
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.admin_roles_path}`).then(res => {
      var newState = this.state;
      newState.roles = res.roles;
      this.setState(newState);
    });
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    const { user } = nextProps;
    newState.user = user;
    this.setState(newState);
  }

  resolvedUpdatePassword(password, password_confirmation) {
    this.updatePasswordModal.setSubmitDisable(true);
    this.updatePasswordModal.setLoaded(false);
    client
      .post(`${URL_CONFIG.users_path}/${this.props.user.id}/update_password`, {
        user: {
          password: password,
          password_confirmation: password_confirmation
        }
      })
      .then(
        response => {
          this.updatePasswordModal.setSubmitDisable(false);
          this.updatePasswordModal.setLoaded(true);
          this.updatePasswordModal.close();
        },
        response => {
          this.updatePasswordModal.setSubmitDisable(false);
          this.updatePasswordModal.setLoaded(true);
          if (response.status == 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            } else if (response.responseJSON.hasOwnProperty("error")) {
              $(document).trigger("ei:showAlert", [response.responseJSON.error]);
            }
          }
        }
      );
  }

  openUpdatePasswordModal() {
    this.updatePasswordModal.open();
  }

  render() {
    let { roles } = this.state;
    let { user } = this.state;
    let { parent } = this.props;

    let userCardListTpl;
    if (this.state.user.id) {
      userCardListTpl = (
        <div>
          <UserPaymentList user={this.props.user} {...this.props} addresses={this.props.user.billing_addresses} />
        </div>
      );
    }

    return (
      <Form horizontal>
        <UserFormCore
          user={user}
          parent={parent}
          openUpdatePasswordModal={::this.openUpdatePasswordModal}
          roles={roles}
        />

        <h4>Billing Address</h4>
        <UserBillingAddressList
          fromIndex={16}
          billing_addresses={user.billing_addresses}
          addNewBillingAddress={this.props.addNewBillingAddress}
          parent={parent}
        />
        {userCardListTpl}
        <UserUpdatePasswordModal ref={c => (this.updatePasswordModal = c)} resolvedFn={::this.resolvedUpdatePassword} />
      </Form>
    );
  }
}
