import React from "react";
import classNames from "classnames";
import { Link, withRouter } from "react-router";

import { SidebarBtn, Navbar, Nav, NavItem, Icon, Grid, Row, Col } from "@sketchpixy/rubix";
import { URL_CONFIG } from "./config";
import client from "./http-client";
import { inject, observer } from "mobx-react/index";

@inject("store")
@observer
class Brand extends React.Component {
  render() {
    const settings = this.props.store.settings;
    return (
      <Navbar.Header>
        <Navbar.Brand tabIndex="-1">
          <a href="#">
            <img src={settings.logo} alt={settings.site_name} width="auto" height="30" />
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

@withRouter
class HeaderNavigation extends React.Component {
  logout() {
    client.delete(`${URL_CONFIG.logout_path}`).then(res => {
      $('meta[name="csrf-token"]').attr("content", res.csrfToken);
      this.props.router.push(URL_CONFIG.login_path);
    });
  }

  render() {
    var props = {
      className: classNames("pull-right", this.props.className)
    };

    return (
      <Nav {...props}>
        <NavItem className="logout" onClick={::this.logout}>
          <Icon bundle="fontello" glyph="off-1" />
        </NavItem>
      </Nav>
    );
  }
}

@withRouter
class HeaderNavigationUser extends React.Component {
  logout() {
    client.delete(`${URL_CONFIG.logout_path}`).then(res => {
      $('meta[name="csrf-token"]').attr("content", res.csrfToken);
      this.props.router.push(URL_CONFIG.login_path);
    });
  }

  goToDashboard() {
    this.props.router.push(URL_CONFIG.dashboard_path);
  }

  goToWebsite() {
    this.props.router.push(URL_CONFIG.dashboard_path);
  }

  render() {
    var props = {
      className: classNames("pull-right", this.props.className)
    };

    return (
      <Nav {...props} pullRight>
        <NavItem onClick={::this.goToDashboard}>Member Dashboard</NavItem>
        <NavItem divider />
        <NavItem onClick={::this.goToWebsite}>Back To Website</NavItem>
        <NavItem divider />
        <NavItem className="logout" onClick={::this.logout}>
          <Icon bundle="fontello" glyph="off-1" />
        </NavItem>
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    return (
      <Grid id="navbar">
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id="rubix-nav-header">
              <Row>
                <Col xs={3} visible="xs">
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={3}>
                  <Brand {...this.props} />
                </Col>
                <Col xs={3} sm={9} collapseRight className="text-right" xsHidden>
                  {(() => {
                    if (this.props.is_user) {
                      return <HeaderNavigationUser />;
                    } else {
                      return <HeaderNavigation />;
                    }
                  })()}
                </Col>
                <Col xs={3} visible="xs">
                  <HeaderNavigation />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
