import React from "react";
import Select from "react-select";
import Toggle from "react-toggle";
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Icon,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";
import _ from "lodash";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";

import { map, includes } from "lodash/collection";
import { isEmpty } from "lodash/lang";

import { inject, observer } from "mobx-react";
import LocationPicker from "../components/homebase-settings/location-picker";

@inject("store")
export default class HomebaseSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      homebase_phone: "",
      app_admin: "",
      location: {
        latitude: 47.648735,
        longitude: -122.343492
      },
      admin_users: [],
      service_request_types: [
        {
          key: "ice",
          active: true
        },
        {
          key: "water",
          active: true
        },
        {
          key: "ski_pack",
          active: true
        },
        {
          key: "picnic_box",
          active: true
        },
        {
          key: "cooler_and_ice",
          active: true
        }
      ],
      sos_types: [
        {
          key: "boat_leaking",
          active: true
        },
        {
          key: "need_aid",
          active: true
        },
        {
          key: "had_collision",
          active: true
        },
        {
          key: "engine_not_start",
          active: true
        },
        {
          key: "man_overboard",
          active: true
        },
        {
          key: "no_fuel",
          active: true
        }
      ]
    };
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeAppAdmin = this.handleChangeAppAdmin.bind(this);
    this.toggleServiceRequestType = this.toggleServiceRequestType.bind(this);
    this.toggleSOSType = this.toggleSOSType.bind(this);
  }

  componentDidMount(prevProps) {
    this.requestAdminUsers().then(() => {
      this.requestVars();
    });
  }

  render() {
    const { state, handleChangeInput, handleChangeAppAdmin } = this;
    const { app_admin, admin_users, service_request_types, sos_types } = state;
    const app_admin_user = _.find(admin_users, ["email", app_admin]);
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Form horizontal>
                <Row className="panel-header">
                  <Col md={12}>
                    <Col md={6}>
                      <h3>The Boaters App Settings</h3>
                    </Col>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Col md={12}>
                      <h4 className="section-form-title">General</h4>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        App Admin
                      </Col>
                      <Col sm={9}>
                        <Select
                          value={app_admin_user}
                          labelKey="email"
                          valueKey="email"
                          options={admin_users}
                          onChange={handleChangeAppAdmin}
                        />
                        <small>
                          <em>Admin's account in charge of receiving message from user</em>
                        </small>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Service Request Types
                      </Col>
                      <Col sm={9}>
                        {service_request_types.map(service_request_type => {
                          return (
                            <div key={service_request_type.key}>
                              <label style={{ display: "flex" }}>
                                <Toggle
                                  checked={service_request_type.active}
                                  onChange={this.toggleServiceRequestType}
                                  name={service_request_type.key}
                                />
                                <span style={{ marginLeft: 10 }}>
                                  {CONSTANT.serviceRequestTypeObj[service_request_type.key].name}
                                </span>
                              </label>
                            </div>
                          );
                        })}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        SOS Types
                      </Col>
                      <Col sm={9}>
                        {sos_types.map(sos_type => {
                          return (
                            <div key={sos_type.key}>
                              <label style={{ display: "flex" }}>
                                <Toggle checked={sos_type.active} onChange={this.toggleSOSType} name={sos_type.key} />
                                <span style={{ marginLeft: 10 }}>{CONSTANT.sosTypeObj[sos_type.key].name}</span>
                              </label>
                            </div>
                          );
                        })}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Homebase Phone
                      </Col>
                      <Col sm={9}>
                        <FormControl
                          type="text"
                          name="homebase_phone"
                          value={this.state.homebase_phone}
                          onChange={this.handleChangeInput}
                        />
                      </Col>
                    </FormGroup>
                    <Col md={12}>
                      <h4 className="section-form-title">Location</h4>
                    </Col>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel} />
                      <Col sm={9}>
                        <LocationPicker location={this.state.location} onTick={::this.handleChangeLocation} />
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
    );
  }

  requestVars() {
    const vars = `homebase_phone,homebase_location_latitude,homebase_location_longitude,app_admin,service_request_types,sos_types`;
    return client.get(`${URL_CONFIG.find_batch_path}?vars=${vars}`).then(res => {
      this.transformSettingData(res);
    });
  }

  requestAdminUsers() {
    return client.get(URL_CONFIG.admin_users_path).then(res => {
      this.setState({ admin_users: res });
    });
  }

  transformSettingData(settingObj) {
    const { state } = this;
    const homebase_phone = settingObj.homebase_phone || "";
    const location = {
      latitude: settingObj.homebase_location_latitude || state.location.latitude,
      longitude: settingObj.homebase_location_longitude || state.location.longitude
    };
    const app_admin = settingObj.app_admin || "";
    let service_request_types = state.service_request_types;
    if (settingObj.service_request_types && settingObj.service_request_types.length > 0) {
      service_request_types = _.attempt(() => {
        return JSON.parse(settingObj.service_request_types);
      });
      if (_.isError(service_request_types)) {
        service_request_types = state.service_request_types;
      }
    }
    let sos_types = state.sos_types;
    if (settingObj.sos_types && settingObj.sos_types.length > 0) {
      sos_types = _.attempt(() => {
        return JSON.parse(settingObj.sos_types);
      });
      if (_.isError(sos_types)) {
        sos_types = state.sos_types;
      }
    }
    this.setState({
      homebase_phone,
      location,
      app_admin,
      service_request_types,
      sos_types
    });
  }

  transformSubmitData() {
    var settings = [];
    const { state } = this;
    settings.push({
      key: "homebase_phone",
      value: state.homebase_phone
    });
    settings.push({
      key: "homebase_location_latitude",
      value: state.location.latitude
    });
    settings.push({
      key: "homebase_location_longitude",
      value: state.location.longitude
    });
    settings.push({
      key: "app_admin",
      value: state.app_admin
    });
    settings.push({
      key: "app_admin",
      value: state.app_admin
    });
    settings.push({
      key: "service_request_types",
      value: JSON.stringify(state.service_request_types)
    });
    settings.push({
      key: "sos_types",
      value: JSON.stringify(state.sos_types)
    });
    return settings;
  }

  setSubmitDisable(val) {
    var newState = this.state;
    newState.submitDisabled = val;
    this.setState(newState);
  }

  onSubmitFn() {
    this.setSubmitDisable(true);
    client
      .put(URL_CONFIG.update_batch_settings_path, {
        settings: this.transformSubmitData()
      })
      .then(
        res => {
          util.growl(res.message);
          this.setSubmitDisable(false);
        },
        response => {
          this.setSubmitDisable(false);
        }
      );
  }

  handleChangePhone(e) {
    this.setState({
      homebase_phone: e.target.value
    });
  }

  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleChangeAppAdmin(app_admin) {
    if (app_admin && app_admin.email) {
      this.setState({ app_admin: app_admin.email });
    } else {
      this.setState({ app_admin: "" });
    }
  }

  handleChangeLocation(location) {
    const { lat, lng } = location;
    this.setState({
      location: {
        latitude: lat,
        longitude: lng
      }
    });
  }

  toggleServiceRequestType(e) {
    const value = e.target.checked;
    const name = e.target.name;
    const { service_request_types } = this.state;
    const service_request_type = _.find(service_request_types, ["key", name]);
    service_request_type.active = value;
    this.setState({ service_request_types });
  }

  toggleSOSType(e) {
    const value = e.target.checked;
    const name = e.target.name;
    const { sos_types } = this.state;
    const sos_type = _.find(sos_types, ["key", name]);
    sos_type.active = value;
    this.setState({ sos_types });
  }
}
