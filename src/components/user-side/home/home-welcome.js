import React from "react";

import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer, PanelHeader, Button, Nav, NavItem } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import { Link, withRouter } from "react-router";

@withRouter
@inject("store")
@observer
export default class HomeWelcome extends React.Component {
  render() {
    const user = this.props.store.user;
    const settings = this.props.store.settings;
    let isDailyUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;

    if ((user.is_added_payment_method && user.is_paid_membership_charges) || isDailyUser) {
      return null;
    }

    return (
      <PanelContainer controls={false} className="home-welcome">
        <Panel>
          <PanelHeader className="bg-green">
            <Grid>
              <Row>
                <Col xs={12} className="fg-white home-welcome-title">
                  <h4>Welcome to your {settings.site_name} account</h4>
                </Col>
              </Row>
            </Grid>
          </PanelHeader>
          <PanelBody>
            <Grid>
              <Row>
                {(() => {
                  if (!user.is_added_payment_method) {
                    return (
                      <Col sm={6} xs={12} className="before-doing before-book-lesson">
                        <h5>
                          <span className="red">Before</span> you can book a lesson
                        </h5>
                        <ul>
                          <li>
                            &bull; Please update your{" "}
                            <Link to={{ pathname: URL_CONFIG.profile_user_path, query: { active_tab: "billing" } }}>
                              payment method
                            </Link>
                          </li>
                        </ul>
                      </Col>
                    );
                  }
                })()}

                <Col
                  sm={6}
                  xs={12}
                  smOffset={user.is_added_payment_method ? 3 : 0}
                  className="before-doing before-book-boat"
                >
                  <h5>
                    <span className="red">Before</span> you can book a boat
                  </h5>
                  <ul>
                    {(() => {
                      if (!user.is_added_payment_method) {
                        return (
                          <li>
                            &bull; Please update your{" "}
                            <Link to={{ pathname: URL_CONFIG.profile_user_path, query: { active_tab: "billing" } }}>
                              payment method
                            </Link>
                          </li>
                        );
                      }
                    })()}
                    {(() => {
                      if (!user.is_paid_membership_charges) {
                        return (
                          <li>
                            &bull; Select & purchase your{" "}
                            <Link to={{ pathname: URL_CONFIG.profile_user_path, query: { active_tab: "billing" } }}>
                              Sharepass Membership
                            </Link>
                          </li>
                        );
                      }
                    })()}
                    <li>
                      &bull;{" "}
                      <a href={`${settings.website_url}/contact`} target="_blank">
                        Contact {settings.site_name}
                      </a>{" "}
                      to schedule your evaluation
                    </li>
                  </ul>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
