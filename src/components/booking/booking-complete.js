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

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";
import BookingCharge from "../_core/booking/booking-charge";
import BookingPhotoListUpload from "./booking-photo-list-upload";
import BookingPhotoList from "./booking-photo-list";
import BookingChecklists from "./checklist/booking-checklists";
import BookingCompleteNote from "./booking-complete-note";
import BookingSummary from "./booking-summary";

import { flatMap, every, some } from "lodash/collection";

export default class BookingComplete extends React.Component {
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
      request_a_review: false,
      checklists: [],
      submitDisabled: false
    };
    this.handleChangeRequestAReview = this.handleChangeRequestAReview.bind(this);
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

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  handleChangeLineItemField(line_item, field, value) {
    let { booking_line_items } = this.state.booking;
    let newState = this.state;
    let found_line_item = booking_line_items.find(booking_line_item => {
      return (
        (booking_line_item.line_item_type == "boolean" && line_item.id == booking_line_item.line_item_id) ||
        booking_line_item.line_item_type == line_item.line_item_type
      );
    });
    if (found_line_item) {
      found_line_item[field] = value;
    } else {
      let newLineItem = {
        id: new Date().getTime(),
        line_item_id: line_item.id,
        booking_id: this.state.booking.id
      };
      newLineItem[field] = value;
      if (line_item.line_item_type) {
        newLineItem["line_item_type"] = line_item.line_item_type;
      } else {
        //Default is boolean line_item_type
        newLineItem["line_item_type"] = "boolean";
      }
      booking_line_items.push(newLineItem);
    }
    this.setState(newState);
  }

  handleChangeNote(value) {
    let newState = this.state;
    newState.booking.complete_notes = value;
    this.setState(newState);
  }

  fuelChargePresent(booking) {
    let { charges } = booking;
    let foundCharge = charges.find(charge => {
      return charge.charge_type == CONSTANT.CHARGE_TYPE.fuel.key;
    });
    return typeof foundCharge == "object";
  }

  checkValidChecklist() {
    let { booking_line_items } = this.state.booking;

    let { checklists } = this.state;

    let booking_line_items_boolean = booking_line_items.filter(booking_line_item => {
      return booking_line_item.line_item_type == "boolean";
    });

    let checklist_line_items = flatMap(checklists, checklist => checklist.line_items);

    return every(checklist_line_items, item => {
      return some(booking_line_items_boolean, booking_item => {
        return item.id === booking_item.line_item_id;
      });
    });
  }

  onCheckInBoat() {
    let { booking } = this.state;
    const { booking_type } = booking;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    if (!isAdminLessonBooking && !this.fuelChargePresent(booking)) {
      util.growlError("fuel_charge_need_added");
      return;
    }

    if (!this.checkValidChecklist()) {
      util.growlError("checklist_not_valid");
      return;
    }
    let { booking_line_items } = booking;
    let submitBookingLineItem = this.transformChecklistData(booking_line_items);
    let booking_id = this.props.params.id;
    this.setSubmitDisable(true);
    client
      .put(`${URL_CONFIG.bookings_path}/${this.props.params.id}/process_check_in_boat`, {
        booking: {
          booking_line_items_attributes: submitBookingLineItem,
          complete_notes: booking.complete_notes
        }
      })
      .then(
        () => {
          this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
        },
        () => {
          this.setSubmitDisable(false);
        }
      );
  }

  pendingChargePresent(booking) {
    let { charges } = booking;
    let pendingCharge = charges.find(charge => {
      return charge.status == CONSTANT.CHARGE_STATUS.created || charge.status == CONSTANT.CHARGE_STATUS.failed;
    });
    return typeof pendingCharge == "object";
  }

  onCompleteBookingFn() {
    let { booking, request_a_review } = this.state;
    const { booking_type } = booking;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    if (!isAdminLessonBooking && this.pendingChargePresent(booking)) {
      util.growlError("pending_charge_need_pay");
      return;
    }
    if (!this.checkValidChecklist()) {
      util.growlError("checklist_not_valid");
      return;
    }
    let booking_id = this.props.params.id;
    let { booking_line_items } = booking;
    let submitBookingLineItem = this.transformChecklistData(booking_line_items);
    this.setSubmitDisable(true);
    client
      .put(`${URL_CONFIG.bookings_path}/${booking_id}/complete_booking`, {
        booking: {
          booking_line_items_attributes: submitBookingLineItem
        },
        request_a_review
      })
      .then(
        () => {
          this.setSubmitDisable(false);
          this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
        },
        () => {
          this.setSubmitDisable(false);
        }
      );
  }

  transformChecklistData() {
    let { booking } = this.state;
    let { booking_line_items } = booking;
    let result = booking_line_items.map(line_item => {
      return {
        booking_id: line_item.booking_id,
        booking_checklist_line_item_id: line_item.line_item_id,
        value: line_item.value,
        value_string: line_item.value_string,
        line_item_type: line_item.line_item_type
      };
    });
    return result;
  }

  handleChangeBookingCharges(charges) {
    let newState = this.state;
    this.state.booking.charges = charges;
    this.setState(newState);
  }

  refreshCharges() {
    let { id } = this.props.params;

    //TODO: Refactor by query charge list only
    client.get(`${URL_CONFIG.bookings_path}/${id}`).then(res => {
      if (res && res.charges && res.charges.length > 0) {
        var newState = this.state;
        newState.booking.charges = res.charges;
        this.setState(newState);
      }
    });
  }

  render() {
    const { booking, checklists, request_a_review } = this.state;
    let { booking_line_items, booking_type } = booking;
    let { BOOKING_STATUS } = CONSTANT;
    let title = this.props.check_in_boat ? "Check In Boat" : "Complete Booking";

    let before_images = booking.booking_images.filter(booking_image => {
      return booking_image.photo_type == "before";
    });

    let after_images = booking.booking_images.filter(booking_image => {
      return booking_image.photo_type == "after";
    });
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    after_images = { files: after_images };

    return (
      <PanelContainer noOverflow className="payment-form">
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col md={12}>
                  <h3>{title}</h3>
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
              <BookingPhotoListUpload images={after_images} type="after" booking={booking} parent={this} />
              {(() => {
                if (checklists && checklists.length > 0) {
                  return (
                    <div>
                      <Row>
                        <Col md={12}>
                          <h4 className="section-form-title">Checklist</h4>
                        </Col>
                      </Row>
                      <BookingChecklists
                        handleChangeLineItemField={::this.handleChangeLineItemField}
                        checklists={checklists}
                        booking={booking}
                        booking_line_items={booking_line_items}
                      />
                    </div>
                  );
                }
              })()}
              {!isAdminLessonBooking && (
                <div>
                  <Row>
                    <Col md={12}>
                      <h4 className="section-form-title">Charges</h4>
                    </Col>
                  </Row>
                  <BookingCharge
                    booking_complete
                    booking={booking}
                    refreshCharges={::this.refreshCharges}
                    handleChangeBookingCharges={::this.handleChangeBookingCharges}
                  />
                </div>
              )}
              <BookingCompleteNote
                title="Booking Complete Notes"
                note={booking.complete_notes}
                handleChangeNote={::this.handleChangeNote}
              />
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12} style={{ marginBottom: 15 }}>
                  <br />
                  {booking.status == BOOKING_STATUS.checked_in && (
                    <label className="text-right" style={{ marginBottom: 0, fontWeight: "normal" }}>
                      <small>
                        Request a review
                        <input
                          checked={request_a_review}
                          onChange={this.handleChangeRequestAReview}
                          type="checkbox"
                          style={{ marginLeft: 3 }}
                        />
                      </small>
                    </label>
                  )}
                  {(() => {
                    if (booking.status == BOOKING_STATUS.in_use || booking.status == BOOKING_STATUS.processing) {
                      return (
                        <Button
                          outlined
                          bsStyle="primary"
                          onClick={::this.onCheckInBoat}
                          disabled={this.state.submitDisabled}
                        >
                          Check In Boat
                        </Button>
                      );
                    } else if (booking.status == BOOKING_STATUS.checked_in) {
                      return (
                        <Button
                          outlined
                          bsStyle="primary"
                          onClick={::this.onCompleteBookingFn}
                          disabled={this.state.submitDisabled}
                        >
                          Complete Booking
                        </Button>
                      );
                    }
                  })()}
                  <br />
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
      </PanelContainer>
    );
  }

  handleChangeRequestAReview(e) {
    this.setState({
      request_a_review: e.target.checked
    });
  }
}
