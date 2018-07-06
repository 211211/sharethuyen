import React from "react";

import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";
import { mapKeys } from "lodash/object";
import { includes } from "lodash/collection";
import SketchColorPicker from "../components/branding-settings/sketch-color-picker";
import ImageUploadPreview from "../components/branding-settings/image-upload-preview";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";

import { inject, observer } from "mobx-react";

@inject("store")
export default class BrandingSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      site_name: "",
      site_email: "",
      admin_email: "",
      website_url: "",
      branding_color: "",
      logo: "",
      logo_file: null,
      background_image: "",
      background_image_file: null,
      email_image: "",
      email_image_file: null,
      displayColorPicker: false,
      yelp_review_url: ""
    };
  }

  componentDidMount() {
    client.get(URL_CONFIG.settings_path).then(res => {
      let newState = this.transformBrandingSettings(res);
      this.setState(newState);
    });
  }

  transformBrandingSettings(settingObj) {
    let newState = this.state;

    mapKeys(newState, (value, key) => {
      newState[key] = settingObj[key];
    });

    return newState;
  }

  transformSubmitData() {
    let formData = new FormData();
    mapKeys(this.state, (value, key) => {
      if (value) {
        formData.append(`settings[${key}]`, value);
      }
    });
    return formData;
  }

  setSubmitDisable(val) {
    this.setState({
      submitDisabled: val
    });
  }

  onSubmitFn() {
    this.setSubmitDisable(true);
    let settings = this.transformSubmitData();
    client.putFormData(URL_CONFIG.update_branding_settings_path, settings).then(
      res => {
        util.growl(res.message);
        this.props.store.updateSettings(res.settings);
        let newState = this.transformBrandingSettings(res.settings);
        this.setState(newState);
        this.setSubmitDisable(false);
      },
      response => {
        this.setSubmitDisable(false);
      }
    );
  }

  handleChangeSetting(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleColorsChangeSetting(color) {
    this.setState({ branding_color: color.hex });
  }

  handleSettingImageChange(settingKey, file) {
    let newState = this.state;

    // Populate dummy value, so backend will `know` it need to upload file,
    // and store file URL to this settingKey
    newState[settingKey] = "dummy";
    newState[`${settingKey}_file`] = file;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Form horizontal>
                  <Row className="page-header">
                    <Col md={12}>
                      <h3>Branding Settings</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Col md={12}>
                        <h4 className="section-form-title">General</h4>
                      </Col>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Site Name
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="string"
                            name="site_name"
                            value={this.state.site_name}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Site Email
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="string"
                            name="site_email"
                            value={this.state.site_email}
                            onChange={::this.handleChangeSetting}
                          />
                          <em>
                            <small>
                              Used as sender. Send email to welcome new user, inform charge, remind incoming booking,
                              etc
                            </small>
                          </em>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Admin Email
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="string"
                            name="admin_email"
                            value={this.state.admin_email}
                            onChange={::this.handleChangeSetting}
                          />
                          <em>
                            <small>
                              Used as receivers. Get notified when users request deposit return, book a lesson, boat
                              back from yard, etc. Multiple emails can be used, separate by commas.
                            </small>
                          </em>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Website URL
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="string"
                            name="website_url"
                            value={this.state.website_url}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Yelp Review URL
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="string"
                            name="yelp_review_url"
                            value={this.state.yelp_review_url}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Col md={12}>
                        <h4 className="section-form-title">Colors</h4>
                      </Col>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Branding Color
                        </Col>
                        <Col sm={9}>
                          <SketchColorPicker
                            color={this.state.branding_color}
                            handleChange={::this.handleColorsChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Col md={12}>
                        <h4 className="section-form-title">Images</h4>
                      </Col>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Logo
                        </Col>
                        <Col sm={9}>
                          <ImageUploadPreview
                            setting_key="logo"
                            image={this.state.logo}
                            onFileChange={::this.handleSettingImageChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Background Image
                        </Col>
                        <Col sm={9}>
                          <ImageUploadPreview
                            setting_key="background_image"
                            image={this.state.background_image}
                            onFileChange={::this.handleSettingImageChange}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Email Image
                        </Col>
                        <Col sm={9}>
                          <ImageUploadPreview
                            setting_key="email_image"
                            image={this.state.email_image}
                            onFileChange={::this.handleSettingImageChange}
                          />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </Grid>
            </PanelBody>
            <PanelFooter className="text-right">
              <Grid>
                <Row>
                  <Col md={12} style={{ marginBottom: 10 }}>
                    <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={this.state.submitDisabled}>
                      Update
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </PanelFooter>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
