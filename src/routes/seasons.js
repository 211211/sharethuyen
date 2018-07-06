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

import DepositReturnList from "../components/season/deposit-return-list";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";

import { inject } from "mobx-react";
import { mapKeys } from "lodash/object";
import { includes } from "lodash/collection";

@inject("store")
export default class Seasons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_season: 2017,
      renewal_discount_percent: 10,
      tier_1_before_day: 30,
      single_user_renewal_price_tier1: 0,
      single_user_renewal_message_tier1: "",
      mid_week_user_renewal_price_tier1: 0,
      mid_week_user_renewal_message_tier1: "",
      group_user_renewal_price_tier1: 0,
      group_user_renewal_message_tier1: "",
      tier_2_after_day: 30,
      single_user_renewal_price_tier2: 0,
      single_user_renewal_message_tier2: "",
      mid_week_user_renewal_price_tier2: 0,
      mid_week_user_renewal_message_tier2: "=",
      group_user_renewal_price_tier2: 0,
      group_user_renewal_message_tier2: ""
    };
  }

  componentDidMount() {
    client.get(URL_CONFIG.settings_path).then(res => {
      let newState = this.transformEndSeasonData(res);
      this.setState(newState);
    });
  }

  transformEndSeasonData(settingObj) {
    let newState = this.state;

    mapKeys(newState, (value, key) => {
      newState[key] = settingObj[key];
    });

    return newState;
  }

  transformSubmitData() {
    let settings = [];
    mapKeys(this.state, (value, key) => {
      settings.push({
        key: key,
        value: value
      });
    });

    return settings;
  }

  setSubmitDisable(val) {
    this.setState({
      submitDisabled: val
    });
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
          this.props.store.updateSettings(res.settings);
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

  render() {
    let disabledUserTypes = this.props.store.settings.disabled_user_types || [];

    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Form horizontal>
                  <Row className="page-header">
                    <Col md={12}>
                      <h3>Renewal Settings</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Renewal Discount Percent
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="number"
                            name="renewal_discount_percent"
                            value={this.state.renewal_discount_percent}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>

                      {/*TIER 1*/}
                      <Col md={12}>
                        <h4 className="section-form-title">Tier 1</h4>
                        <p>Apply this tier BEFORE expire number of days</p>
                      </Col>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          # of date
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="number"
                            name="tier_1_before_day"
                            value={this.state.tier_1_before_day}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.full)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Full User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="single_user_renewal_price_tier1"
                                    value={this.state.single_user_renewal_price_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Full User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="single_user_renewal_message_tier1"
                                    value={this.state.single_user_renewal_message_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}

                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.mid_week)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Mid Week User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="mid_week_user_renewal_price_tier1"
                                    value={this.state.mid_week_user_renewal_price_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Mid Week User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="mid_week_user_renewal_message_tier1"
                                    value={this.state.mid_week_user_renewal_message_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}

                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.shared)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Group User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="group_user_renewal_price_tier1"
                                    value={this.state.group_user_renewal_price_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Group User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="group_user_renewal_message_tier1"
                                    value={this.state.group_user_renewal_message_tier1}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}

                      {/*TIER 2*/}
                      <Col md={12}>
                        <h4 className="section-form-title">Tier 2</h4>
                        <p>Apply this tier AFTER expire number of days</p>
                      </Col>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          # of date
                        </Col>
                        <Col sm={9}>
                          <FormControl
                            type="number"
                            name="tier_2_after_day"
                            value={this.state.tier_2_after_day}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.full)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Full User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="single_user_renewal_price_tier2"
                                    value={this.state.single_user_renewal_price_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Full User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="single_user_renewal_message_tier2"
                                    value={this.state.single_user_renewal_message_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}

                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.mid_week)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Mid Week User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="mid_week_user_renewal_price_tier2"
                                    value={this.state.mid_week_user_renewal_price_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Mid Week User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="mid_week_user_renewal_message_tier2"
                                    value={this.state.mid_week_user_renewal_message_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}

                      {(() => {
                        if (!includes(disabledUserTypes, CONSTANT.MEMBERSHIP_TYPE.shared)) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Group User Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="group_user_renewal_price_tier2"
                                    value={this.state.group_user_renewal_price_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Group User Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="group_user_renewal_message_tier2"
                                    value={this.state.group_user_renewal_message_tier2}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                            </div>
                          );
                        }
                      })()}
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
                      Update Prices & Messages
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </PanelFooter>
          </Panel>
        </PanelContainer>

        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Row className="page-header">
                  <Col md={6}>
                    <h3>Requested Security Deposit Return Users</h3>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <DepositReturnList />
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
