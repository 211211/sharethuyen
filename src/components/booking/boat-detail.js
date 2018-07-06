import React from "react";
import Select from "react-select";

import { Form, FormGroup, Col, Row, Button, FormControl, ControlLabel, Image } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";
import BoatSelectModal from "./boat-select-modal";
import { isNil } from "lodash/lang";

export default class BoatDetail extends React.Component {
  openBoatSelectModal() {
    this.boatSelectModal.wrappedInstance.open(this.props.boat);
  }

  boatSelectResolved(selectedBoat, overrideConfirmed) {
    this.boatSelectModal.wrappedInstance.setLoaded(false);

    if (this.props.boat && this.props.boat.id === selectedBoat.id) {
      this.boatSelectModal.wrappedInstance.close();
      return;
    }

    let booking_id = this.props.booking.id;
    client
      .post(`${URL_CONFIG.bookings_path}/${booking_id}/assign_boat`, {
        boat_id: selectedBoat.id,
        override_confirmed: overrideConfirmed
      })
      .then(
        response => {
          this.boatSelectModal.wrappedInstance.setLoaded(true);
          this.props.onUpdateBoat(selectedBoat, response);
          util.growl("boat_assigned_successfully");
          this.boatSelectModal.wrappedInstance.close();
        },
        response => {
          if (response.status == 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            }
            if (response.responseJSON.hasOwnProperty("error")) {
              util.growlError(response.responseJSON.error);
            }
          }
          this.boatSelectModal.wrappedInstance.setLoaded(true);
          this.boatSelectModal.wrappedInstance.close();
        }
      );
  }

  render() {
    const { booking, boat_class } = this.props;
    const boat = this.props.boat || {};
    const bookingStatus = booking.status;
    const boatAssignable =
      bookingStatus == CONSTANT.BOOKING_STATUS.tba ||
      bookingStatus == CONSTANT.BOOKING_STATUS.confirmed ||
      bookingStatus == CONSTANT.BOOKING_STATUS.in_use;
    const boatNotAssigned = isNil(boat.id);
    if (boatNotAssigned) {
      return (
        <Form horizontal>
          <Col sm={3} />
          <Col sm={9}>
            <em>No boat got assigned</em>
          </Col>
          <Col sm={3} />
          <Col sm={9}>
            <Button outlined bsStyle="info" style={{ marginTop: 10 }} onClick={::this.openBoatSelectModal}>
              Assign Boat
            </Button>
          </Col>
          <BoatSelectModal
            ref={c => (this.boatSelectModal = c)}
            boat_id={boat.id}
            boat_class={boat_class}
            booking_start_date={booking.start_date}
            booking_end_date={booking.end_date}
            resolvedFn={::this.boatSelectResolved}
          />
        </Form>
      );
    }
    return (
      <Form horizontal>
        <Col sm={3} componentClass={ControlLabel}>
          Name
        </Col>
        <Col sm={9}>
          <FormControl.Static>{boat.name}</FormControl.Static>
        </Col>
        {bookingStatus == CONSTANT.BOOKING_STATUS.confirmed && (
          <div>
            <Col sm={3} componentClass={ControlLabel}>
              Fuel Remain
            </Col>
            <Col sm={9}>
              <FormControl.Static>{boat.fuel_remain} x 1/16th</FormControl.Static>
            </Col>
          </div>
        )}
        <Col sm={4} smOffset={3}>
          <Image responsive src={boat.primary_image} />
        </Col>
        <Col sm={6} />
        {boatAssignable && (
          <Col sm={4} smOffset={3}>
            <Button outlined bsStyle="info" style={{ marginTop: 10 }} onClick={::this.openBoatSelectModal}>
              Change Boat
            </Button>
          </Col>
        )}
        <BoatSelectModal
          ref={c => (this.boatSelectModal = c)}
          boat_id={boat.id}
          boat_class={boat_class}
          booking_start_date={booking.start_date}
          booking_end_date={booking.end_date}
          resolvedFn={::this.boatSelectResolved}
        />
      </Form>
    );
  }
}
