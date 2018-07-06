import React from "react";
import { Link, withRouter } from "react-router";
import { observer } from "mobx-react";

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

import { URL_CONFIG, CONSTANT, IMAGES, MESSAGES } from "./config";
import client from "./http-client";

@withRouter
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    let { alert } = this.props.data;
    this.state = {
      user: {
        email: "",
        password: "",
        alert: alert
      }
    };
  }

  login(e) {
    e.preventDefault();
    e.stopPropagation();
    client
      .post(`${URL_CONFIG.login_path}`, {
        user: this.state.user
      })
      .then(
        res => {
          this.props.route.store.updateUser(res.user);
          this.props.route.store.updateSettings(res.settings);
          this.props.route.store.fetchPayment();
          $('meta[name="csrf-token"]').attr("content", res.csrfToken);
          let { MAIN_ROLE } = CONSTANT;
          user_role = res.role;
          if (res.role == MAIN_ROLE.admin || res.role == MAIN_ROLE.dock) {
            this.props.route.store.user_side = false;
            this.props.router.replace(URL_CONFIG.admin_dashboard_path);
          } else {
            this.props.route.store.user_side = true;
            if (res && res.settings && res.settings.down_for_maintenance) {
              this.setState({
                alert: MESSAGES.down_for_maintenance
              });
              return;
            }
            this.props.router.replace(URL_CONFIG.dashboard_path);
          }
        },
        xhr => {
          var res = xhr.responseJSON;
          if (res && res.error) {
            this.setState({
              alert: res.error
            });
          }
        }
      );
  }

  componentDidMount() {
    $("html").addClass("authentication");
  }

  componentWillUnmount() {
    $("html").removeClass("authentication");
  }

  handleChangeEmail(e) {
    this.state.user.email = e.target.value;
  }

  handleChangePassword(e) {
    this.state.user.password = e.target.value;
  }

  render() {
    let { settings } = this.props.route.store;
    let { alert } = this.state;
    //Get alert message from devise
    let alertTpl = alert ? (
      <Alert danger dismissible>
        {alert}
      </Alert>
    ) : null;

    let { notice } = this.props.data;
    let noticeTpl = notice ? (
      <Alert success dismissible>
        {notice}
      </Alert>
    ) : null;
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
                          <h4 style={{ margin: 0, padding: 15, paddingTop: 0 }}>Sign in</h4>
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
                            <FormGroup>{alertTpl}</FormGroup>
                            <FormGroup>{noticeTpl}</FormGroup>
                            <FormGroup controlId="emailaddress">
                              <InputGroup bsSize="large">
                                <InputGroup.Addon>
                                  <Icon glyph="icon-fontello-mail" />
                                </InputGroup.Addon>
                                <FormControl
                                  autoFocus
                                  type="email"
                                  className="border-focus-blue"
                                  onChange={::this.handleChangeEmail}
                                  placeholder="email"
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
                                  onChange={::this.handleChangePassword}
                                  placeholder="password"
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={6} collapseLeft collapseRight>
                                    <Link to={URL_CONFIG.register_path}>Create an account</Link>
                                    <br />
                                    <Link to={`${URL_CONFIG.passwords_path}/new`}>Lost your password?</Link>
                                    <br />
                                    <a href={settings.website_url}>Back to website</a>
                                  </Col>
                                  <Col xs={6} collapseLeft collapseRight className="text-right">
                                    <Button outlined lg type="submit" bsStyle="blue" onClick={::this.login}>
                                      Login
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
