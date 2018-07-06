import React from "react";
import Loader from "react-loader";

import { Form, Col, Alert, Button } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../../common/config";
import client from "../../../common/http-client";
import util from "../../../common/util";
import UserBillingAddressList from "../../_core/user/user-billing-address-list";
import UserUpdatePasswordModal from "../../_core/user/user-update-password-modal";
import UserUtil from "../../user/user-util";
import UserForm from "./profile-overview-form";

// TODO: Need to apply MobX here
export default class ProfileOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: UserUtil.mapUserState({}),
      errors: {},
      loaded: false
    };
  }

  componentDidMount() {
    this.loadUserDetail();
  }

  loadUserDetail() {
    client.get(`${URL_CONFIG.current_user_path}`).then(res => {
      let newState = this.state;
      newState.user = UserUtil.mapUserState(res);
      newState.loaded = true;
      this.setState(newState);
    });
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

  handleFieldChange(field, value) {
    var newState = this.state;
    newState = UserUtil.handleFieldChange(this.state, field, value);
    this.setState(newState);
  }

  onClickSave() {
    let userFormData = UserUtil.buildSubmitUser(this.state.user);
    this.props.setSubmitDisable(true);

    client.putFormData(`${URL_CONFIG.update_profile_user_path}`, userFormData).then(
      response => {
        util.growl("user_profile_update_successfully");
        this.props.setSubmitDisable(false);
        this.loadUserDetail();
      },
      response => {
        this.props.setSubmitDisable(false);
        if (response.status == 400) {
          if (response.responseJSON.hasOwnProperty("errors")) {
            let newState = this.state;
            newState.errors = response.responseJSON.errors;
            this.setState(newState);
          }
        }
      }
    );
  }

  openUpdatePasswordModal() {
    this.updatePasswordModal.open();
  }

  resolvedUpdatePassword(password, password_confirmation) {
    this.updatePasswordModal.setSubmitDisable(true);
    this.updatePasswordModal.setLoaded(false);
    client
      .post(URL_CONFIG.update_password_profile_user_path, {
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
          this.props.router.replace(URL_CONFIG.login_path);
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

  render() {
    let { user } = this.state;
    let { parent } = this.props;

    let { errors } = this.state;
    let errorKeys = Object.keys(errors);

    errors = errorKeys.length ? (
      <Alert danger dismissible>
        {errorKeys.map((field, i) => {
          return (
            <div key={i}>
              <div>
                <strong>{field}:</strong>
              </div>
              <ul>
                {errors[field].map((error, j) => {
                  return <li key={j}>{error}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </Alert>
    ) : null;
    return (
      <div>
        <Loader loaded={this.state.loaded} />
        {(() => {
          if (user && user.id) {
            return (
              <Form horizontal>
                <Col md={12}>{errors}</Col>
                <UserForm
                  user={user}
                  parent={this}
                  openUpdatePasswordModal={::this.openUpdatePasswordModal}
                  roles={[]}
                />

                <h4>Billing Address</h4>
                <UserBillingAddressList
                  fromIndex={16}
                  billing_addresses={user.billing_addresses}
                  addNewBillingAddress={::this.addNewBillingAddress}
                  parent={this}
                />
                <UserUpdatePasswordModal
                  ref={c => (this.updatePasswordModal = c)}
                  resolvedFn={::this.resolvedUpdatePassword}
                />
                <div className="text-right">
                  <Button outlined bsStyle="primary" className="user-side-btn" lg onClick={::this.onClickSave}>
                    Save
                  </Button>
                </div>
              </Form>
            );
          }
        })()}
      </div>
    );
  }
}
