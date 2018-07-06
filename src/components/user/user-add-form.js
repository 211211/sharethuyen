import React from "react";
import ReactDOM from "react-dom";

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

import BoatShareForm from "../_core/boat-share-form";
import UserForm from "./user-form";
import { URL_CONFIG, CONSTANT } from "../../common/config";
import UserUtil from "./user-util";
import client from "../../common/http-client";

export default class UserAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      user: UserUtil.mapUserState({})
    };
  }

  onSubmitFn() {
    let userFormData = UserUtil.buildSubmitUser(this.state.user);
    this.boatShareForm.setSubmitDisable(true);

    client.postFormData(URL_CONFIG.users_path, userFormData).then(
      response => {
        this.props.router.push(URL_CONFIG.users_path);
      },
      response => {
        this.boatShareForm.setSubmitDisable(false);
        if (response.status == 400) {
          if (response.responseJSON.hasOwnProperty("errors")) {
            this.setState({ errors: response.responseJSON.errors });
          }
        }
      }
    );
  }

  addNewBillingAddress() {
    var newBillingAddress = UserUtil.mapBillingAddressState({});
    var newState = this.state;
    newState.user.billing_addresses.push(newBillingAddress);
    this.setState(newState);
  }

  removeBillingAddress(index) {
    var newState = this.state;
    newState.user.billing_addresses[index]._destroy = true;
    this.setState(newState);
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.users_path);
  }

  handleFieldChange(field, value) {
    var newState = this.state;
    newState = UserUtil.handleFieldChange(this.state, field, value);
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add User"
        submitBtn="Create"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <UserForm parent={this} addNewBillingAddress={::this.addNewBillingAddress} user={this.state.user} />
      </BoatShareForm>
    );
  }
}
