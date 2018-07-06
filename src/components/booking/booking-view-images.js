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
  ControlLabel
} from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";
import BookingPhotoList from "./booking-photo-list";
import BookingChecklists from "./checklist/booking-checklists";
import BookingSummary from "./booking-summary";

export default class BookingViewImages extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      booking: {
        booking_images: [],
        booking_line_items: [],
        complete_notes: "",
        user: {},
        charges: [],
        boat: {},
        user_notes: ""
      },
      checklists: [],
      submitDisabled: false
    };
  }

  componentDidMount() {
    this.loadBookingDetail().then(() => {
      this.loadBoatChecklist();
    });
  }

  loadBookingDetail() {
    let step = this.props.check_in_boat ? "check_in_boat" : "";
    let { id } = this.props.params;
    return client.get(`${URL_CONFIG.bookings_path}/${id}`, { step: step }).then(res => {
      let newState = this.state;
      newState.booking = res;
      if (!newState.booking.complete_notes) {
        newState.booking.complete_notes = "";
      }
      this.setState(newState);
    });
  }

  loadBoatChecklist() {
    let boat_id = this.state.booking.boat.id;
    client.get(`${URL_CONFIG.boats_path}/${boat_id}/checklist`).then(res => {
      let newState = this.state;
      newState.checklists = res;
      this.setState(newState);
    });
  }

  backToBooking() {
    let { id } = this.props.params;
    this.props.router.push(`${URL_CONFIG.bookings_path}/${id}`);
  }

  render() {
    let { booking } = this.state;

    let { booking_line_items } = booking;

    let { checklists } = this.state;

    let before_images = booking.booking_images.filter(booking_image => {
      return booking_image.photo_type == "before";
    });

    let after_images = booking.booking_images.filter(booking_image => {
      return booking_image.photo_type == "after";
    });

    return (
      <PanelContainer noOverflow className="payment-form">
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col md={12}>
                  <h3>Booking Images and Checklist</h3>
                </Col>
              </Row>
              <BookingSummary booking={booking} />
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Photo Before</h4>
                </Col>
              </Row>
              <BookingPhotoList images={before_images} />
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Booking Photo After</h4>
                </Col>
              </Row>
              <BookingPhotoList images={after_images} type="after" />
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Checklist</h4>
                </Col>
              </Row>
              <BookingChecklists
                readonly
                checklists={checklists}
                booking={booking}
                booking_line_items={booking_line_items}
              />
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12} style={{ marginBottom: 15 }}>
                  <br />
                  <Button outlined bsStyle="primary" onClick={::this.backToBooking}>
                    Back to Booking
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
