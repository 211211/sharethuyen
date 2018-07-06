import React from "react";
import { Link, withRouter } from "react-router";
import { inject, observer } from "mobx-react";

import { SidebarBtn, Navbar, Nav, NavItem, Icon, Grid, Row, Col, Image } from "@sketchpixy/rubix";
import { URL_CONFIG } from "./config";
import client from "./http-client";

@withRouter
@inject("store")
@observer
export default class HeaderUserSide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navExpanded: false
    };
  }

  logout() {
    client.delete(`${URL_CONFIG.logout_path}`).then(res => {
      $('meta[name="csrf-token"]').attr("content", res.csrfToken);
      this.props.router.push(URL_CONFIG.login_path);
    });
  }

  setNavExpanded(expanded) {
    this.setState({ navExpanded: expanded });
  }

  closeNav() {
    this.setState({ navExpanded: false });
  }

  render() {
    const user = this.props.store.user;
    const settings = this.props.store.settings;
    return (
      <Grid id="navbar">
        <Row>
          <Col xs={12}>
            <Navbar
              fixedTop
              fluid
              id="header-user-side"
              onToggle={::this.setNavExpanded}
              expanded={this.state.navExpanded}
            >
              <Navbar.Header>
                <Link to={URL_CONFIG.dashboard_path}>
                  <Image src={settings.logo} className="boatshare-portal-logo navbar-brand" />
                </Link>
                <Navbar.Toggle />
              </Navbar.Header>

              <Navbar.Collapse>
                <Nav pullRight className="header-menu">
                  <li role="presentation">
                    <Link to={URL_CONFIG.dashboard_path} onClick={::this.closeNav}>
                      Dashboard
                    </Link>
                  </li>
                  <li role="presentation">
                    <Link to={`${URL_CONFIG.user_bookings_path}/new`} onClick={::this.closeNav}>
                      Make a booking
                    </Link>
                  </li>
                  <li role="presentation">
                    <Link to={URL_CONFIG.profile_user_path} onClick={::this.closeNav}>
                      Profile & Billing
                    </Link>
                  </li>
                  <NavItem href={settings.website_url}>Back to website</NavItem>
                  <li role="presentation" className="navbar-text welcome-user hidden-xs">
                    Welcome, {user.first_name || "aaa"}!
                  </li>
                  <NavItem onClick={::this.logout}>Logout</NavItem>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
