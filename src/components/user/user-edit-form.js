import React from "react";
import ReactDOM from "react-dom";
import { inject, observer } from "mobx-react";

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
import { URL_CONFIG } from "../../common/config";
import UserUtil from "./user-util";
import client from "../../common/http-client";

@inject("store")
@observer
export default class UserEditForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      user: UserUtil.mapUserState({})
    };
  }

  componentDidMount() {
    this.loadUserDetail();
  }

  loadUserDetail() {
    let { id } = this.props.params;
    return client.get(`${URL_CONFIG.users_path}/${id}`).then(res => {
      this.setState({
        user: UserUtil.mapUserState(res)
      });
      this.props.store.updateUser(res);
      this.props.store.fetchPayment();
    });
  }

  onSubmitFn() {
    let userFormData = UserUtil.buildSubmitUser(this.state.user);
    this.boatShareForm.setSubmitDisable(true);

    client.putFormData(`${URL_CONFIG.users_path}/${this.props.params.id}`, userFormData).then(
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
    if (newState.user.billing_addresses[index].id) {
      //This billing_address was stored in db
      newState.user.billing_addresses[index]._destroy = true;
    } else {
      newState.user.billing_addresses.splice(index, 1);
    }
    this.setState(newState);
  }

  onCancelFn() {
    this.props.router.push(`${URL_CONFIG.users_path}`);
  }

  handleFieldChange(field, value) {
    var newState = this.state;
    newState = UserUtil.handleFieldChange(this.state, field, value);
    this.setState(newState);
  }

  render() {
    let editEndorsementsUrl = `${URL_CONFIG.users_path}/${this.state.user.id}/endorsement`;
    return (
      <BoatShareForm
        title="Edit User"
        button_right_text="Edit Endorsements"
        button_right_url={editEndorsementsUrl}
        submitBtn="Save"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <UserForm
          parent={this}
          loadUserDetail={::this.loadUserDetail}
          addNewBillingAddress={::this.addNewBillingAddress}
          user={this.state.user}
        />
      </BoatShareForm>
    );
  }
}
