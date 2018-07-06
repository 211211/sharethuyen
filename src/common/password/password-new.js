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
export default class PasswordNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: []
    };
  }

  doResetPassword(e) {
    e.preventDefault();
    e.stopPropagation();
    client
      .post(URL_CONFIG.passwords_path, {
        email: this.state.email
      })
      .then(res => {
        if (res && res.is_notification && res.message) {
          if (res.type == "error") {
            $.growl.error({ message: res.message });
          } else {
            $.growl.notice({ message: res.message });
            this.props.router.replace(URL_CONFIG.login_path);
          }
        }
      });
  }

  handleChangeEmail(e) {
    this.state.email = e.target.value;
  }

  render() {
    let { settings } = this.props.route.store;
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
                          <h4 style={{ margin: 0, padding: 15, paddingTop: 0 }}>Reset Password</h4>
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
                            <FormGroup>
                              <Grid>
                                <Row>
                                  <Col xs={6} collapseLeft collapseRight style={{ paddingTop: 10 }}>
                                    <Link to={URL_CONFIG.login_path}>Go to Login</Link>
                                    <br />
                                    <a href={settings.website_url}>Back to website</a>
                                  </Col>
                                  <Col xs={6} collapseLeft collapseRight className="text-right">
                                    <Button outlined lg type="submit" bsStyle="blue" onClick={::this.doResetPassword}>
                                      Reset My Password
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
