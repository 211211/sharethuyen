import React from "react";

import { Row, Col, Grid, Panel, PanelBody, PanelTabContainer, Button, Nav, NavItem } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";
import HomeBooking from "./home-booking";
import HomeTransaction from "./home-transaction";

export default class HomeFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active_tab: "upcoming_booking"
    };
  }

  componentDidMount() {}

  handleSelectTab(eventKey) {
    let newState = this.state;
    newState.active_tab = eventKey;
    this.setState(newState);
  }

  render() {
    let { active_tab } = this.state;
    return (
      <PanelTabContainer id="pills" defaultActiveKey="upcoming_booking" controls={false}>
        <Panel>
          <PanelBody style={{ padding: "20 0" }}>
            <Grid>
              <Row>
                <Col sm={12}>
                  <Nav bsStyle="pills" onSelect={::this.handleSelectTab} className="nav-light-blue nav-justified">
                    <NavItem eventKey="upcoming_booking">Future Bookings</NavItem>
                    <NavItem eventKey="booking_history">Past Bookings</NavItem>
                    <NavItem eventKey="transaction_history">Transaction History</NavItem>
                  </Nav>
                </Col>
              </Row>
              <Row>
                <Col sm={12} style={{ marginTop: 20 }}>
                  {(() => {
                    switch (active_tab) {
                      case "upcoming_booking":
                        return <HomeBooking booking_type={active_tab} />;
                        break;
                      case "booking_history":
                        return <HomeBooking booking_type={active_tab} />;
                        break;
                      case "transaction_history":
                        return <HomeTransaction />;
                        break;
                    }
                  })()}
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelTabContainer>
    );
  }
}
