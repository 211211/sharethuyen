import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import BookingTable from "../_core/booking/booking-table";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";

export default class UserBookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.users_path}/${id}`).then(user => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    const { id } = this.props.params;
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>{user.full_name && <h4>{user.full_name}'s Bookings</h4>}</Col>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <BookingTable userId={id} ajaxUrl={URL_CONFIG.bookings_path} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
