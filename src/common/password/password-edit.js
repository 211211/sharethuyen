import React from "react";
import { Link, withRouter } from "react-router";
import Loader from "react-loader";

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  FormControl,
  PanelContainer,
  Image
} from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES } from "../config";
import client from "../http-client";
import util from "../util";
import { observer } from "mobx-react/index";

@withRouter
@observer
export default class PasswordEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      submitDisabled: false,
      password: "",
      password_confirmation: "",
      errors: []
    };
  }

  setSubmitDisable(value) {
    let newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  setLoaded(loaded) {
    let newState = this.state;
    newState.loaded = loaded;
    this.setState(newState);
  }

  doChangePassword(e) {
    let { id } = this.props.params;
    e.preventDefault();
    e.stopPropagation();
    this.setSubmitDisable(true);
    this.setLoaded(false);
    client
      .put(`${URL_CONFIG.passwords_path}/${id}`, {
        user: {
          password: this.state.password,
          password_confirmation: this.state.password_confirmation,
          reset_password_token: this.props.location.query.reset_password_token
        }
      })
      .then(
        res => {
          util.growl("change_password_successfully");
          this.props.router.replace(URL_CONFIG.login_path);
          this.setSubmitDisable(false);
          this.setLoaded(true);
        },
        xhr => {
          if (xhr.status == 400) {
            if (xhr.responseJSON.hasOwnProperty("errors")) {
              let newState = this.state;
              newState.errors = xhr.responseJSON.errors;
              this.setState(newState);
            }
          }
          this.setSubmitDisable(false);
          this.setLoaded(true);
        }
      );
  }

  handleChangePassword(e) {
    var newState = this.state;
    newState.password = e.target.value;
    this.setState(newState);
  }

  handleChangeConfirmPassword(e) {
    var newState = this.state;
    newState.password_confirmation = e.target.value;
    this.setState(newState);
  }

  render() {
    let { settings } = this.props.route.store;
    let { errors } = this.state;
    let errorTpl = util.mapErrors(errors);
    return (
      <div id="auth-container" className="login" style={{ backgroundImage: `url(${settings.background_image})` }}>
        <div id="auth-row">
          <div id="auth-cell">
            <Grid>
              <Row>
                <Col sm={6} smOffset={3} lg={4} lgOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false}>
                    <Panel>
                      <PanelBody style={{ padding: 0 }}>
                        <div
                          className="text-center join-panel-header"
                          style={{ backgroundColor: settings.branding_color }}
                        >
                          <Image src={settings.logo} className="login-seattle-logo" />
                          <h4 style={{ margin: 0, padding: 15, paddingTop: 0 }}>Change your password</h4>
                        </div>
                        <div>
                          <Form
                            className={this.state.loaded ? "" : "is-loading"}
                            style={{
                              padding: 25,
                              paddingTop: 0,
                              paddingBottom: 0,
                              margin: "auto",
                              marginBottom: 25,
                              marginTop: 25
                            }}
                          >
                            <Loader loaded={this.state.loaded} />
                            <FormGroup>{errorTpl}</FormGroup>
                            <FormGroup>
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-key" />
                                </InputGroup.Addon>
                                <FormControl
                                  autoFocus
                                  className="border-focus-blue"
                                  type="password"
                                  placeholder="New password"
                                  value={this.state.password}
                                  onChange={::this.handleChangePassword}
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-key" />
                                </InputGroup.Addon>
                                <FormControl
                                  className="border-focus-blue"
                                  type="password"
                                  placeholder="Confirm new password"
                                  value={this.state.password_confirmation}
                                  onChange={::this.handleChangeConfirmPassword}
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={6} collapseLeft collapseRight style={{ paddingTop: 10 }}>
                                    <Link to={URL_CONFIG.login_path}>Go to Login</Link>
                                  </Col>
                                  <Col xs={6} collapseLeft collapseRight className="text-right">
                                    <Button
                                      outlined
                                      lg
                                      type="submit"
                                      bsStyle="blue"
                                      onClick={::this.doChangePassword}
                                      disabled={this.state.submitDisabled}
                                    >
                                      Change My Password
                                    </Button>
                                  </Col>
                                </Row>
                              </Grid>
                            </FormGroup>
                          </Form>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
