import React from "react";
import Select from "react-select";

import { Row, Col, ControlLabel } from "@sketchpixy/rubix";

export default class BookingChargeFuelPending extends React.Component {
  render() {
    return (
      <Row style={{ marginTop: 15 }}>
        <Col xs={2} className="text-right" componentClass={ControlLabel} style={{ paddingTop: 15 }}>
          Fuel Charge
        </Col>
        <Col xs={3} className="text-center section-border-top">
          <em>Pending</em>
        </Col>
        <Col xs={3} className="text-right section-border-top">
          <em>Pending</em>
        </Col>
      </Row>
    );
  }
}
