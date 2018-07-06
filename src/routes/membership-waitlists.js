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

import Toggle from "react-toggle";

import { URL_CONFIG } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";

import { inject } from "mobx-react";
import { mapKeys } from "lodash/object";
import WaitlistTable from "../components/membership-waitlist/waitlist-table";

@inject("store")
export default class MembershipWaitlists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitDisabled: false,
      membership_waitlist_enabled: false,
      membership_waitlist_expired_enabled: false,
      membership_waitlist_price: 100,
      membership_waitlist_message: "Message"
    };
  }

  componentDidMount() {
    this.requestVars();
  }

  requestVars() {
    const vars =
      "membership_waitlist_enabled,membership_waitlist_expired_enabled,membership_waitlist_price,membership_waitlist_message";
    return client.get(`${URL_CONFIG.find_batch_path}?vars=${vars}`).then(res => {
      const {
        membership_waitlist_enabled,
        membership_waitlist_expired_enabled,
        membership_waitlist_price,
        membership_waitlist_message
      } = res;
      this.setState({
        membership_waitlist_enabled,
        membership_waitlist_expired_enabled,
        membership_waitlist_price,
        membership_waitlist_message
      });
    });
  }

  transformSettingData(settingObj) {
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
      .put(URL_CONFIG.update_batch_membership_waitlist_settings_path, {
        settings: this.transformSubmitData()
      })
      .complete(res => {
        this.setSubmitDisable(false);
      });
  }

  handleChangeSetting(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name == "membership_waitlist_price") {
      value = parseInt(value);
    }
    if (name == "membership_waitlist_enabled" && !value) {
      // Turn off membership_waitlist_enabled means turn off for membership_waitlist_expired_enabled
      this.setState({
        membership_waitlist_expired_enabled: false
      });
    }

    this.setState({
      [name]: value
    });
  }

  render() {
    const { submitDisabled } = this.state;
    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Form horizontal>
                  <Row className="page-header">
                    <Col md={12}>
                      <h3>Membership Waitlist Settings</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Col sm={3} componentClass={ControlLabel}>
                          Enable for new members?
                        </Col>
                        <Col sm={9}>
                          <Toggle
                            name="membership_waitlist_enabled"
                            checked={this.state.membership_waitlist_enabled}
                            onChange={::this.handleChangeSetting}
                          />
                        </Col>
                      </FormGroup>
                      {(() => {
                        if (this.state.membership_waitlist_enabled) {
                          return (
                            <div>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Enable for expired members also?
                                </Col>
                                <Col sm={9}>
                                  <Toggle
                                    name="membership_waitlist_expired_enabled"
                                    checked={this.state.membership_waitlist_expired_enabled}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Membership Waitlist Price
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    type="number"
                                    name="membership_waitlist_price"
                                    value={this.state.membership_waitlist_price}
                                    onChange={::this.handleChangeSetting}
                                  />
                                </Col>
                              </FormGroup>
                              <FormGroup>
                                <Col sm={3} componentClass={ControlLabel}>
                                  Membership Waitlist Message
                                </Col>
                                <Col sm={9}>
                                  <FormControl
                                    componentClass="textarea"
                                    name="membership_waitlist_message"
                                    value={this.state.membership_waitlist_message}
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
                    <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={submitDisabled}>
                      Update Settings
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
                    <h3>Waitlist</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <WaitlistTable />
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
