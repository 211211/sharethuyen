import React from "react";
import ReactDOM from "react-dom";
import ModalConfirm from "../components/_core/modal-confirm";
import { URL_CONFIG } from "../common/config";
import BookingTable from "../components/_core/booking/booking-table";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer, FormControl } from "@sketchpixy/rubix";

import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class Bookings extends React.Component {
  constructor(props) {
    super(props);
  }

  openAddForm() {
    this.props.router.push(`${URL_CONFIG.bookings_path}/new`);
  }

  openAddHappyHourForm() {
    this.props.router.push(`${URL_CONFIG.bookings_path}/new_happy_hour`);
  }

  openRedFlagBookings() {
    this.props.router.push(`${URL_CONFIG.bookings_red_flags_path}`);
  }

  render() {
    let happyHourEnabled = this.props.store.settings.happy_hour_enabled;

    let addHappyHourButton = happyHourEnabled ? (
      <Button outlined bsStyle="primary" onClick={::this.openAddHappyHourForm}>
        Add Happy Hour
      </Button>
    ) : null;

    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={3}>
                    <h4>Bookings</h4>
                  </Col>
                  <Col md={9} className="text-right">
                    <Button outlined bsStyle="primary" onClick={::this.openRedFlagBookings}>
                      Red Flag Bookings
                    </Button>{" "}
                    <Button outlined bsStyle="primary" onClick={::this.openAddForm}>
                      Add
                    </Button>{" "}
                    {addHappyHourButton}
                  </Col>
                </Col>
              </Row>
              <Row className="boat-amenity-tbl">
                <Col md={12}>
                  <BookingTable ajaxUrl={URL_CONFIG.bookings_path} />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
