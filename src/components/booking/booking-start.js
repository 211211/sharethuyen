import React from "react";

import {
  Row,
  Col,
  Grid,
  FormGroup,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  Checkbox,
  PanelFooter,
  FormControl,
  ModalConfirm,
  ControlLabel
} from "@sketchpixy/rubix";

import FuelActions from "../_core/boat-fuel/fuel-actions";
import BookingPhotoListUpload from "./booking-photo-list-upload";
import BookingSecurityDeposit from "./booking-security-deposit";
import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";

export default class BookingStart extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      booking: {
        booking_images: [],
        boat: {}
      },
      term_accepted: false,
      submitDisabled: true,
      settings: {
        t_and_c_on_check_out: ""
      }
    };
  }

  componentDidMount() {
    this.loadBookingDetail();
    client.get(`${URL_CONFIG.settings_path}`).then(res => {
      var newState = this.state;
      newState.settings.t_and_c_on_check_out = res.t_and_c_on_check_out;
      this.setState(newState);
    });
  }

  loadBookingDetail() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.bookings_path}/${id}`).then(res => {
      let newState = this.state;
      newState.booking = res;
      newState.term_accepted = res.start_booking_at ? true : false;
      this.setState(newState);
    });
  }

  setSubmitDisable(value) {
    this.setState({
      submitDisabled: value
    });
  }

  onStartBookingFn() {
    if (!this.securityDeposit.isValid()) return;

    let params = this.securityDeposit.getValues();

    this.setSubmitDisable(true);
    let booking_id = this.props.params.id;
    client.put(`${URL_CONFIG.bookings_path}/${booking_id}/start_booking`, params).then(
      response => {
        if (response.type !== "error") {
          this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
        }
        this.setSubmitDisable(false);
      },
      () => {
        this.setSubmitDisable(false);
      }
    );
  }

  onChangeTermCheckbox(e) {
    this.state.term_accepted = e.target.checked;
    this.setSubmitDisable(!e.target.checked);
  }

  render() {
    const { booking } = this.state;
    let before_images = booking.booking_images.filter(booking_image => {
      return booking_image.photo_type === "before";
    });
    const { boat } = booking || {};
    const { fuel_meter_enabled } = boat;
    before_images = { files: before_images };
    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col md={12}>
                  <h3>Start Booking</h3>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Photo Before</h4>
                </Col>
              </Row>
              <BookingPhotoListUpload images={before_images} type="before" booking={this.state.booking} parent={this} />
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Fuel Information</h4>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Col sm={3} componentClass={ControlLabel}>
                      Fuel Remain
                    </Col>
                    <Col sm={9}>
                      <FormControl.Static>{boat.fuel_remain} x 1/16th</FormControl.Static>
                    </Col>
                  </FormGroup>
                </Col>
                {fuel_meter_enabled && (
                  <Col md={12}>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Fuel Meter
                      </Col>
                      <Col sm={9}>
                        <FormControl.Static>{boat.fuel_meter}</FormControl.Static>
                      </Col>
                    </FormGroup>
                  </Col>
                )}
                <Col md={12} style={{ marginLeft: 25 }}>
                  <FuelActions
                    boat={boat}
                    bookingId={booking.id}
                    fuelUpdateSuccess={::this.loadBookingDetail}
                    changeMeterSuccess={::this.loadBookingDetail}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Security Deposit</h4>
                </Col>
              </Row>
              <BookingSecurityDeposit
                type="before"
                booking={this.state.booking}
                ref={c => (this.securityDeposit = c)}
              />

              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Terms and Conditions agreement</h4>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {this.state.settings.t_and_c_on_check_out.split("\n").map(function(item, key) {
                    return (
                      <span key={key}>
                        {item}
                        <br />
                      </span>
                    );
                  })}
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Checkbox
                      name="checkbox-options"
                      checked={this.state.term_accepted}
                      onChange={::this.onChangeTermCheckbox}
                    >
                      I agree to the Terms
                    </Checkbox>
                  </FormGroup>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12} style={{ marginBottom: 15 }}>
                  <br />
                  <Button
                    outlined
                    bsStyle="primary"
                    onClick={::this.onStartBookingFn}
                    disabled={this.state.submitDisabled}
                  >
                    Start Booking
                  </Button>
                  <br />
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }
}
