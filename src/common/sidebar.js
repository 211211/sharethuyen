import React from "react";

import {
  Sidebar,
  SidebarNav,
  SidebarNavItem,
  SidebarControls,
  SidebarControlBtn,
  LoremIpsum,
  Grid,
  Row,
  Col,
  FormControl,
  Label,
  Progress,
  Icon,
  SidebarDivider
} from "@sketchpixy/rubix";

import { Link } from "react-router";
import { state, CONSTANT } from "./config";

class ApplicationSidebar extends React.Component {
  handleChange(e) {
    this._nav.search(e.target.value);
  }
  render() {
    let is_admin = user_role == CONSTANT.MAIN_ROLE.admin;

    let sidebar_nav_tpl = (
      <div className="sidebar-nav-container">
        <SidebarNav style={{ marginBottom: 0 }} ref={c => (this._nav = c)}>
          {/** Pages Section */}
          <div className="sidebar-header">PAGES</div>

          <SidebarNavItem glyph="icon-fontello-gauge" name="Dashboard" href="/admin/dashboard" />
          <SidebarNavItem glyph="icon-simple-line-icons-basket" name="Booking" href="/admin/bookings" />
        </SidebarNav>
      </div>
    );
    if (is_admin) {
      sidebar_nav_tpl = (
        <div className="sidebar-nav-container">
          <SidebarNav style={{ marginBottom: 0 }} ref={c => (this._nav = c)}>
            {/** Pages Section */}
            <div className="sidebar-header">PAGES</div>

            <SidebarNavItem glyph="icon-fontello-gauge" name="Dashboard" href="/admin/dashboard" />
            <SidebarNavItem glyph="icon-outlined-boat" name="Boat" href="/admin/boats" />
            <SidebarNavItem glyph="icon-simple-line-icons-basket" name="Booking" href="/admin/bookings" />
            <SidebarNavItem glyph="icon-outlined-profile" name="User" href="/admin/users" />
            <SidebarNavItem glyph="icon-fontello-money-2" name="Transaction" href="/admin/transactions" />
            <SidebarNavItem glyph="icon-dripicons-user-group" name="Group" href="/admin/groups" />
            <SidebarNavItem glyph="icon-outlined-todolist" name="Boat Class" href="/admin/boat_classes" />
            <SidebarNavItem glyph="icon-ikons-grid-2" name="Boat Amenity" href="/admin/boat_amenities" />
            <SidebarNavItem glyph="icon-nargela-lock-open" name="Endorsements" href="/admin/endorsements" />
            <SidebarNavItem
              glyph="icon-outlined-todolist-check"
              name="Booking Checklist"
              href="/admin/booking_checklist_categories"
            />
            <SidebarNavItem glyph="icon-simple-line-icons-graduation" name="Lessons" href="/admin/lessons" />
            <SidebarNavItem glyph="icon-simple-line-icons-settings" name="Setting" href="/admin/settings" />
            <SidebarNavItem
              glyph="icon-simple-line-icons-settings"
              name="Booking Setting"
              href="/admin/booking_settings"
            />
            <SidebarNavItem glyph="icon-simple-line-icons-calendar" name="Season" href="/admin/seasons" />
            <SidebarNavItem glyph="icon-simple-line-icons-tag" name="Pricing Settings" href="/admin/pricing_settings" />
            <SidebarNavItem
              glyph="icon-simple-line-icons-badge"
              name="Branding Settings"
              href="/admin/branding_settings"
            />
            <SidebarNavItem
              glyph="icon-simple-line-icons-settings"
              name="App Settings"
              href="/admin/homebase_settings"
            />
            <SidebarNavItem
              glyph="icon-fontello-heart-empty-3"
              name="Member Waitlists"
              href="/admin/membership_waitlists"
            />
            <SidebarNavItem
              glyph="icon-fontello-heart-empty-3"
              name="Class Waitlists"
              href="/admin/boat_class_waitlists"
            />
            <SidebarNavItem glyph="icon-simple-line-icons-support" name="Addons" href="/admin/addons" />
            <SidebarNavItem
              glyph="icon-simple-line-icons-support"
              name="Email Templates"
              href="/admin/email_templates"
            />
          </SidebarNav>
        </div>
      );
    }
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <FormControl
                type="text"
                placeholder="Search..."
                onChange={::this.handleChange}
                className="sidebar-search"
                style={{
                  border: "none",
                  background: "none",
                  margin: "10px 0 0 0",
                  borderBottom: "1px solid #666",
                  color: "white"
                }}
              />
              {sidebar_nav_tpl}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default class SidebarContainer extends React.Component {
  render() {
    return (
      <div id="sidebar">
        <div id="avatar">
          <Grid>
            <Row className="fg-white">
              <Col xs={4} collapseRight>
                <img
                  src={user_profile_picture ? user_profile_picture : "/imgs/app/avatars/avatar0.png"}
                  width="40"
                  height="40"
                />
              </Col>
              <Col xs={8} collapseLeft id="avatar-col">
                <div style={{ top: 15, fontSize: 16, lineHeight: 1, position: "relative" }}>{user_name}</div>
              </Col>
            </Row>
          </Grid>
        </div>
        <div id="sidebar-container">
          <Sidebar sidebar={0}>
            <ApplicationSidebar />
          </Sidebar>
        </div>
      </div>
    );
  }
}
