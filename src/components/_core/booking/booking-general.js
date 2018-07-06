import React from "react";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import S from "string";
import { Link, withRouter } from "react-router";

import { Form, FormGroup, Col, FormControl, ControlLabel } from "@sketchpixy/rubix";

import { CONSTANT, URL_CONFIG } from "../../../common/config";
import Util from "../../../common/util";
import { isNumber, isString } from "lodash";

@withRouter
@inject("store", "newBookingStore")
@observer
export default class BookingGeneral extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }
  onChangeDepartureTime(e) {
    this.booking.departure_time = e.target.value;
  }

  render() {
    const { type, mode, user_side } = this.props;
    const isAddMode = mode === "ADD";

    // TODO: Currently, this prefer the booking to pass over the props, later, we should move the booking to the store
    const booking = this.props.booking || this.booking;
    const departureTimes = this.filterOutDepartureTime(booking.start_date);
    const isUserPresent = booking.user && booking.user.email;
    const isBoatClassPresent = booking.boat_class && booking.boat_class.name;
    const isStartDatePresent = booking.start_date;
    const isEndDatePresent = booking.end_date;
    const totalDays =
      isStartDatePresent && isEndDatePresent ? booking.end_date.diff(booking.start_date, "days") + 1 : 0;
    const { status, start_date, end_date, start_date_was, end_date_was } = booking;
    const startDateChanged = start_date && start_date_was && start_date_was.diff(start_date, "days") != 0;
    const endDateChanged = end_date && end_date_was && end_date_was.diff(end_date, "days") != 0;
    const { discount_percent, discount_notes, booking_type } = booking;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    return (
      <Form horizontal className="booking-detail">
        {!isAddMode && <StaticFormGroup label="Booking #" value={booking.id} />}
        {!isAddMode &&
          !user_side && (
            <StaticFormGroup
              label="Status"
              value={`${S(booking.status)
                .humanize()
                .s.toUpperCase()} ${booking.no_show ? " - NO SHOW" : ""}`}
            />
          )}
        {!user_side && (
          <FormGroup controlId="staticControl">
            <Col sm={3} componentClass={ControlLabel}>
              User
            </Col>
            <Col sm={9}>
              {isUserPresent && (
                <FormControl.Static>
                  <Link to={`${URL_CONFIG.users_path}/${booking.user.id}/edit`}>
                    {booking.user.full_name + " " + booking.user.email}
                  </Link>
                </FormControl.Static>
              )}
            </Col>
          </FormGroup>
        )}
        <StaticFormGroup label="Class of Boat" value={isBoatClassPresent ? booking.boat_class.name : ""} />
        <FormGroup controlId="staticControl">
          <Col sm={3} componentClass={ControlLabel}>
            Start Date
          </Col>
          <Col sm={3}>
            <FormControl.Static>
              {isStartDatePresent ? start_date.format(CONSTANT.DATE_FORMAT_DISPLAY) : ""}{" "}
              <del>{startDateChanged ? start_date_was.format(CONSTANT.DATE_FORMAT_DISPLAY) : ""}</del>
            </FormControl.Static>
          </Col>
          {(status == CONSTANT.BOOKING_STATUS["in_use"] ||
            status == CONSTANT.BOOKING_STATUS["completed"] ||
            status == CONSTANT.BOOKING_STATUS["checked_in"] ||
            status == CONSTANT.BOOKING_STATUS["processing"]) && (
            <div>
              <Col sm={3} componentClass={ControlLabel}>
                Fuel Start
              </Col>
              <Col sm={3}>
                <FormControl.Static>{booking.fuel_start} x 1/16th</FormControl.Static>
              </Col>
            </div>
          )}
        </FormGroup>
        <FormGroup controlId="staticControl">
          <Col sm={3} componentClass={ControlLabel}>
            End Date
          </Col>
          <Col sm={3}>
            <FormControl.Static>
              {isEndDatePresent ? end_date.format(CONSTANT.DATE_FORMAT_DISPLAY) : ""}{" "}
              <del>{endDateChanged ? end_date_was.format(CONSTANT.DATE_FORMAT_DISPLAY) : ""}</del>
            </FormControl.Static>
          </Col>

          {(status == CONSTANT.BOOKING_STATUS["completed"] || status == CONSTANT.BOOKING_STATUS["checked_in"]) && (
            <div>
              <Col sm={3} componentClass={ControlLabel}>
                Fuel End
              </Col>
              <Col sm={3}>
                <FormControl.Static>{booking.fuel_end} x 1/16th</FormControl.Static>
              </Col>
            </div>
          )}
          {booking.check_in_boat_at && (
            <div>
              <Col sm={3} componentClass={ControlLabel}>
                Check In Boat At
              </Col>
              <Col sm={3}>
                <FormControl.Static>{booking.check_in_boat_at}</FormControl.Static>
              </Col>
            </div>
          )}
        </FormGroup>
        <FormGroup controlId="selectScheduledDepartTime">
          <Col sm={3} componentClass={ControlLabel}>
            Scheduled Departure Time
          </Col>
          <Col sm={3}>
            {(() => {
              if (isAddMode) {
                return (
                  <FormControl
                    componentClass="select"
                    value={booking.departure_time}
                    onChange={::this.onChangeDepartureTime}
                  >
                    {departureTimes.map(departureTime => {
                      return (
                        <option key={departureTime} value={departureTime}>
                          {departureTime}
                        </option>
                      );
                    })}
                  </FormControl>
                );
              } else {
                return <FormControl.Static>{booking.departure_time}</FormControl.Static>;
              }
            })()}
          </Col>
          {booking.start_booking_at && (
            <div>
              <Col sm={3} componentClass={ControlLabel}>
                Actual Departure Time
              </Col>
              <Col sm={3}>
                <FormControl.Static>{booking.start_booking_at}</FormControl.Static>
              </Col>
            </div>
          )}
        </FormGroup>
        <StaticFormGroup label="Total Days" value={totalDays} />
        {!isAddMode &&
          isAdminLessonBooking && (
            <StaticFormGroup label="Booking Type" value={booking.admin_use ? "Admin Use" : "Lesson Use"} />
          )}
        {booking.system_notes &&
          booking.system_notes.length > 0 && <StaticFormGroup label="System Notes" value={booking.system_notes} />}
        {isNumber(discount_percent) &&
          discount_percent !== 0 && <StaticFormGroup label="Discount Percent" value={discount_percent} />}
        {isString(discount_notes) &&
          discount_notes.length > 0 && <StaticFormGroup label="Discount Notes" value={discount_notes} />}
      </Form>
    );
  }

  filterOutDepartureTime(start_date) {
    const { type, booking_settings, booking_settings_loaded, mode } = this.props;
    const isAddMode = mode === "ADD";
    let departureTimes = [];
    if (isAddMode && booking_settings_loaded && start_date) {
      departureTimes = CONSTANT.departureTimes;
      if (type === "happy_hour") {
        departureTimes = ["", "04:00pm", "04:30pm", "05:00pm", "05:30pm", "06:00pm"];
      }
      const dayIndex = start_date.day();
      const reservationTime = booking_settings["last_reservation_by_date"][CONSTANT.dayOfWeekIndex[dayIndex]];
      departureTimes = departureTimes.filter(departureTime => {
        return departureTime === "" || Util.convertTimeToSec(departureTime) <= reservationTime;
      });

      const { return_before, end_date } = this.booking;

      // This is one-day booking, and it need to return soon for 2nd booking
      if (start_date.isSame(end_date) && return_before) {
        departureTimes = departureTimes.filter(departureTime => {
          return departureTime === "" || Util.convertTimeToSec(departureTime) <= return_before;
        });
      }
    }
    return departureTimes;
  }
}

class StaticFormGroup extends React.Component {
  render() {
    const { label, value } = this.props;
    return (
      <FormGroup controlId="staticControl">
        <Col sm={3} componentClass={ControlLabel}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl.Static style={{ whiteSpace: "pre" }}>{value}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }
}
