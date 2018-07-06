import React from "react";

import { Col, PanelContainer, Panel, PanelBody, Grid, Row } from "@sketchpixy/rubix";
import WaitlistTable from "../components/boat-class-waitlist/waitlist-table";

export default class BoatClassWaitlists extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="page-header">
                <Col md={6}>
                  <h3>Boat Class Waitlist</h3>
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
    );
  }
}
