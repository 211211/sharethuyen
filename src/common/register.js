import React from "react";
import { Link, withRouter } from "react-router";

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Panel,
  Button,
  Alert,
  PanelBody,
  FormGroup,
  InputGroup,
  FormControl,
  PanelContainer,
  Image
} from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES } from "./config";
import client from "./http-client";
import util from "./util";
import { observer } from "mobx-react/index";

@withRouter
@observer
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    let { group_id, invited_email } = props.location.query;
    this.state = {
      user: {
        email: invited_email || "",
        first_name: "",
        last_name: "",
        password: "",
        password_confirmation: "",
        invited_email: invited_email,
        group_id: group_id
      },
      errors: []
    };
  }

  doRegister(e) {
    e.preventDefault();
    e.stopPropagation();
    let { user } = this.state;
    client
      .post(URL_CONFIG.register_path, {
        user: user
      })
      .then(
        res => {
          util.growl("registration_successfully");
          this.props.router.replace(URL_CONFIG.login_path);
        },
        xhr => {
          if (xhr.status == 400) {
            if (xhr.responseJSON.hasOwnProperty("errors")) {
              let newState = this.state;
              newState.errors = xhr.responseJSON.errors;
              this.setState(newState);
            }
          }
        }
      );
  }

  handleChangeUserInfo(e) {
    let user = this.state.user;
    let field = e.target.name;
    user[field] = e.target.value;
    this.setState({
      user: user
    });
  }

  render() {
    let { settings } = this.props.route.store;
    let { errors } = this.state;
    let errorTpl = util.mapErrors(errors);
    return (
      <div
        id="auth-container"
        className="login register"
        style={{ backgroundImage: `url(${settings.background_image})` }}
      >
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
                          <h4 style={{ margin: 0, padding: 15, paddingTop: 0 }}>Create your Account</h4>
                        </div>
                        <div>
                          <Form
                            style={{
                              padding: 25,
                              paddingTop: 0,
                              paddingBottom: 0,
                              margin: "auto",
                              marginBottom: 25,
                              marginTop: 25
                            }}
                          >
                            <FormGroup>{errorTpl}</FormGroup>
                            <FormGroup controlId="emailaddress">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-mail" />
                                </InputGroup.Addon>
                                <FormControl
                                  autoFocus
                                  type="email"
                                  className="border-focus-blue"
                                  value={this.state.user.email}
                                  name="email"
                                  onChange={::this.handleChangeUserInfo}
                                  placeholder="email"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup controlId="firstName">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-user" />
                                </InputGroup.Addon>
                                <FormControl
                                  type="text"
                                  className="border-focus-blue"
                                  name="first_name"
                                  onChange={::this.handleChangeUserInfo}
                                  placeholder="first name"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup controlId="lastName">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-user" />
                                </InputGroup.Addon>
                                <FormControl
                                  type="text"
                                  className="border-focus-blue"
                                  name="last_name"
                                  onChange={::this.handleChangeUserInfo}
                                  placeholder="last name"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup controlId="password">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-key" />
                                </InputGroup.Addon>
                                <FormControl
                                  type="password"
                                  className="border-focus-blue"
                                  name="password"
                                  onChange={::this.handleChangeUserInfo}
                                  placeholder="password"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup controlId="confirmPassword">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-key" />
                                </InputGroup.Addon>
                                <FormControl
                                  type="password"
                                  className="border-focus-blue"
                                  name="password_confirmation"
                                  onChange={::this.handleChangeUserInfo}
                                  placeholder="confirm password"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={6} collapseLeft collapseRight style={{ paddingTop: 10 }}>
                                    <Link to={URL_CONFIG.login_path}>Go to Login</Link>
                                    <br />
                                    <a href={settings.website_url}>Back to website</a>
                                  </Col>
                                  <Col xs={6} collapseLeft collapseRight className="text-right">
                                    <Button outlined lg type="submit" bsStyle="blue" onClick={::this.doRegister}>
                                      JOIN
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
