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

import SimpleImagePreview from "../../_core/simple-image-preview";

export default class ProfileOverviewForm extends React.Component {
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

  handleChangeProfilePic(e) {
    this.props.parent.handleFieldChange("profile_picture", e.target.files[0]);
  }

  render() {
    let { roles } = this.props;
    let { user } = this.state;

    var passwordTpl;
    if (!user.id) {
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
                value={user.password}
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
                value={user.password_confirmation}
                onChange={::this.handleChangeConfirmPassword}
              />
            </Col>
          </FormGroup>
        </div>
      );
    }

    return (
      <div>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Email <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl tabIndex="1" type="text" placeholder="Email" disabled autoFocus value={user.email} />
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
              value={user.first_name}
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
              value={user.last_name}
              onChange={::this.handleChangeLastName}
            />
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
          if (user.profile_picture_url && user.profile_picture_url.length > 0) {
            return (
              <FormGroup>
                <Col sm={3} />
                <Col sm={2} className="profile-picture">
                  <SimpleImagePreview
                    image_url={user.profile_picture_url}
                    image_thumb_url={user.profile_picture_thumb_url}
                  />
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
              value={user.phone}
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
              value={user.secondary_phone}
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
              value={user.address}
              onChange={::this.handleChangeAddress}
            />
          </Col>
        </FormGroup>
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
}
