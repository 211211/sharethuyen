import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import BookingTable from "../_core/booking/booking-table";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";

export default class BoatBooking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boat: {}
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.boats_path}/${id}`).then(res => {
      var newState = this.state;
      newState.boat = res;
      this.setState(newState);
    });
  }

  render() {
    let { boat } = this.state;
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>
                    <h4>{boat.name}</h4>
                  </Col>
                </Col>
              </Row>
              <Row className="boat-amenity-tbl">
                <Col md={12}>
                  <BookingTable boatId={this.props.params.id} ajaxUrl={URL_CONFIG.bookings_path} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
