import React from "react";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  Checkbox,
  PanelHeader,
  PanelFooter,
  FormControl,
  Icon,
  ModalConfirm,
  Image,
  ControlLabel
} from "@sketchpixy/rubix";

const BookingSummary = ({ booking }) => (
  <div>
    <Row>
      <Col md={12}>
        <h4 className="section-form-title">Summary</h4>
      </Col>
    </Row>
    <Form horizontal className="booking-detail">
      {(() => {
        if (booking.boat) {
          return (
            <div>
              <FormGroup controlId="staticControl">
                <Col sm={3} componentClass={ControlLabel}>
                  Boat Name:
                </Col>
                <Col sm={9}>
                  <FormControl.Static>{booking.boat.name}</FormControl.Static>
                </Col>
              </FormGroup>
              <FormGroup controlId="staticControl">
                <Col sm={3} componentClass={ControlLabel} />
                <Col sm={4} xs={6}>
                  <FormControl.Static>
                    <Image responsive src={booking.boat.primary_image} />
                  </FormControl.Static>
                </Col>
              </FormGroup>
            </div>
          );
        }
      })()}

      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          Booking #:
        </Col>
        <Col sm={9}>
          <FormControl.Static>{booking.id}</FormControl.Static>
        </Col>
      </FormGroup>
      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          Member name:
        </Col>
        <Col sm={9}>
          <FormControl.Static>{booking.user.full_name}</FormControl.Static>
        </Col>
      </FormGroup>
      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          Booking Start At:
        </Col>
        <Col sm={9}>
          <FormControl.Static>{booking.start_booking_at}</FormControl.Static>
        </Col>
      </FormGroup>
      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          Booking End At:
        </Col>
        <Col sm={9}>
          <FormControl.Static>{booking.check_in_boat_at}</FormControl.Static>
        </Col>
      </FormGroup>
      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          Notes:
        </Col>
        <Col sm={9}>
          <FormControl.Static>
            <p>
              {booking.user_notes.split("\n").map(function(item, index) {
                return (
                  <span key={index}>
                    {item} <br />
                  </span>
                );
              })}
            </p>
          </FormControl.Static>
        </Col>
      </FormGroup>
    </Form>
  </div>
);

export default BookingSummary;
