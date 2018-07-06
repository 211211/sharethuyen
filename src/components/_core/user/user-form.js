import React from "react";
import ReactDOM from "react-dom";
import Toggle from "react-toggle";
import Select from "react-select";

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

import { CONSTANT } from "../../../common/config";
import AppUtil from "../../../common/util";
import MembershipTypeUtil from "../../../common/membership-type-util";
import BoatShareImg from "../boat-share-img";

import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.user = nextProps.user;
    this.setState(newState);
  }

  handleChangeEmail(e) {
    this.props.parent.handleFieldChange("email", e.target.value);
  }

  handleChangeFirstName(e) {
    this.props.parent.handleFieldChange("first_name", e.target.value);
  }

  handleChangeLastName(e) {
    this.props.parent.handleFieldChange("last_name", e.target.value);
  }

  handleChangePhone(e) {
    this.props.parent.handleFieldChange("phone", e.target.value);
  }

  handleChangeSecondaryPhone(e) {
    this.props.parent.handleFieldChange("secondary_phone", e.target.value);
  }

  handleChangePassword(e) {
    this.props.parent.handleFieldChange("password", e.target.value);
  }

  handleChangeConfirmPassword(e) {
    this.props.parent.handleFieldChange("password_confirmation", e.target.value);
  }

  handleChangeAddress(e) {
    this.props.parent.handleFieldChange("address", e.target.value);
  }

  handleChangeBalance(e) {
    this.props.parent.handleFieldChange("balance", e.target.value);
  }

  handleChangeProfilePic(e) {
    this.props.parent.handleFieldChange("profile_picture", e.target.files[0]);
  }

  handleCheckActive(e) {
    this.props.parent.handleFieldChange("is_active", e.target.checked);
  }

  onMouseSelectRole(e) {
    var el = $(e.target);
    this.props.parent.handleFieldChange("role_ids", [el.val()]);
    this.props.parent.handleFieldChange("role", el.val());
  }

  render() {
    let disabledUserTypes = this.props.store.settings.disabled_user_types || [];
    let { roles } = this.props;

    let availableRoles = MembershipTypeUtil.removeDisabledRoles(roles, disabledUserTypes);

    let passwordTpl;

    if (!this.state.user.id) {
      passwordTpl = (
        <div>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Password <span className="req-field">*</span>
            </Col>
            <Col sm={9}>
              <FormControl
                type="password"
                tabIndex="2"
                placeholder="Password"
                value={this.state.user.password}
                onChange={::this.handleChangePassword}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={3} componentClass={ControlLabel}>
              Password Confirmation <span className="req-field">*</span>
            </Col>
            <Col sm={9}>
              <FormControl
                type="password"
                tabIndex="3"
                placeholder="Confirmation Password"
                value={this.state.user.password_confirmation}
                onChange={::this.handleChangeConfirmPassword}
              />
            </Col>
          </FormGroup>
        </div>
      );
    }

    if (!this.state.user.role && roles && roles.length > 0) {
      this.state.user.role = roles.filter(role => {
        return role.name == CONSTANT.ROLE.user_single.name;
      })[0].id;
    }

    return (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Email <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="1"
              type="text"
              placeholder="Email"
              autoFocus
              value={this.state.user.email}
              onChange={::this.handleChangeEmail}
            />
          </Col>
        </FormGroup>
        {passwordTpl}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            First Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="4"
              type="text"
              placeholder="First Name"
              value={this.state.user.first_name}
              onChange={::this.handleChangeFirstName}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Last Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="5"
              type="text"
              placeholder="Last Name"
              value={this.state.user.last_name}
              onChange={::this.handleChangeLastName}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Role
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="6"
              componentClass="select"
              placeholder="select"
              value={this.state.user.role}
              onChange={::this.onMouseSelectRole}
            >
              {availableRoles.map(role => {
                return (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                );
              })}
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Profile Picture
          </Col>
          <Col sm={9}>
            <FormControl tabIndex="7" type="file" onChange={::this.handleChangeProfilePic} />
          </Col>
        </FormGroup>
        {(() => {
          if (this.props.user.profile_picture_url && this.props.user.profile_picture_url.length > 0) {
            return (
              <FormGroup>
                <Col sm={3} />
                <Col sm={9}>
                  <Col sm={3} className="profile-picture">
                    <BoatShareImg image_url={this.props.user.profile_picture_url} title="Primary" />
                  </Col>
                </Col>
              </FormGroup>
            );
          }
        })()}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Phone
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="8"
              type="text"
              placeholder="Phone"
              value={this.state.user.phone}
              onChange={::this.handleChangePhone}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Secondary Phone
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="9"
              type="text"
              placeholder="Secondary Phone"
              value={this.state.user.secondary_phone}
              onChange={::this.handleChangeSecondaryPhone}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Address
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="10"
              type="text"
              placeholder="Address"
              value={this.state.user.address}
              onChange={::this.handleChangeAddress}
            />
          </Col>
        </FormGroup>

        <FormGroup controlId="staticControl">
          <Col sm={3} componentClass={ControlLabel}>
            User Balance
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="10"
              type="number"
              placeholder="User Balance"
              value={this.state.user.balance}
              onChange={::this.handleChangeBalance}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Active
          </Col>
          <Col sm={9}>
            <label>
              <Toggle checked={this.state.user.is_active} onChange={::this.handleCheckActive} />
            </label>
          </Col>
        </FormGroup>
        {(() => {
          if (this.state.user.id) {
            return (
              <div>
                <FormGroup>
                  <Col sm={3} />
                  <Col sm={9}>
                    <Button outlined bsStyle="info" onClick={this.props.openUpdatePasswordModal}>
                      Update Password
                    </Button>
                  </Col>
                </FormGroup>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
