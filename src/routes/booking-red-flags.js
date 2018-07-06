import React from "react";
import ReactDOM from "react-dom";
import ModalConfirm from "../components/_core/modal-confirm";
import { URL_CONFIG } from "../common/config";
import BookingTable from "../components/_core/booking/booking-red-flags-table";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer, FormControl } from "@sketchpixy/rubix";

import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class BookingRedFlags extends React.Component {
  render() {
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>
                    <h4>Bookings with red flags</h4>
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
