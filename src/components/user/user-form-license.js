import React from "react";

import { Col, FormGroup, FormControl, ControlLabel, Image, Button, Icon } from "@sketchpixy/rubix";

import ModalConfirm from "../_core/modal-confirm";

export default class UserFormLicense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_profile: props.user_profile
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.user_profile = nextProps.user_profile;
    this.setState(newState);
  }

  handleChangeWaStateMarineLicensePic(e) {
    this.props.parent.handleFieldChange("user_profile.wa_state_marine_photo", e.target.files[0]);
    this.props.parent.handleFieldChange(`user_profile.wa_state_marine_photo_url_del`, undefined);
  }

  handleChangeWaStateMarineLicenseField(e) {
    this.props.parent.handleFieldChange("user_profile.wa_state_marine_field", e.target.value);
  }

  handleChangeDriverLicensePic(e) {
    this.props.parent.handleFieldChange("user_profile.driver_license_photo", e.target.files[0]);
    this.props.parent.handleFieldChange(`user_profile.driver_license_photo_url_del`, undefined);
  }

  handleChangeDriverLicenseField(e) {
    this.props.parent.handleFieldChange("user_profile.driver_license_field", e.target.value);
  }

  render() {
    const { user_profile } = this.state;
    const { wa_state_marine_photo_url, driver_license_photo_url } = user_profile;
    return (
      <div>
        <h4 className="section-form-title">Licenses</h4>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            WA State Boaters card
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="12"
              type="text"
              placeholder="WA State Boaters card"
              value={this.state.user_profile.wa_state_marine_field}
              onChange={::this.handleChangeWaStateMarineLicenseField}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} />
          <Col sm={9}>
            <FormControl tabIndex="13" type="file" onChange={::this.handleChangeWaStateMarineLicensePic} />
          </Col>
        </FormGroup>
        {wa_state_marine_photo_url &&
          wa_state_marine_photo_url.length > 0 && (
            <LicensePhoto
              photoUrl={wa_state_marine_photo_url}
              onClickRemovePhoto={() => {
                this.onClickRemovePhoto("wa_state_marine_photo_url");
              }}
            />
          )}
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Driver License
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="14"
              type="text"
              placeholder="Driver License"
              value={this.state.user_profile.driver_license_field}
              onChange={::this.handleChangeDriverLicenseField}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} />
          <Col sm={9}>
            <FormControl tabIndex="15" type="file" onChange={::this.handleChangeDriverLicensePic} />
          </Col>
        </FormGroup>
        {driver_license_photo_url &&
          driver_license_photo_url.length > 0 && (
            <LicensePhoto
              photoUrl={driver_license_photo_url}
              onClickRemovePhoto={() => {
                this.onClickRemovePhoto("driver_license_photo_url");
              }}
            />
          )}
        <ModalConfirm
          message="Do you want to remove this Photo?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removePhotoKey}
        />
      </div>
    );
  }

  onClickRemovePhoto(removeKey) {
    this.removeKey = removeKey;
    this.confirmDeleteModal.open();
  }

  removePhotoKey() {
    const { user_profile } = this.state;
    user_profile[this.removeKey] = "";
    this.props.parent.handleFieldChange(`user_profile.${this.removeKey}`, "");
    this.props.parent.handleFieldChange(`user_profile.${this.removeKey}_del`, true);
    this.confirmDeleteModal.close();
  }
}

class LicensePhoto extends React.Component {
  render() {
    const { onClickRemovePhoto, photoUrl } = this.props;
    return (
      <FormGroup className="bs-license-photo">
        <Col sm={3} />
        <Col sm={9}>
          <Col className="photo-wrap">
            <Image responsive src={photoUrl} />
            <Button bsStyle="danger" className="remove-btn" onClick={onClickRemovePhoto}>
              <Icon glyph="icon-simple-line-icons-close" />
            </Button>
          </Col>
        </Col>
      </FormGroup>
    );
  }
}
