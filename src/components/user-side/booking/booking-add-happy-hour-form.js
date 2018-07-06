import React from "react";
import { withRouter, Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Alert } from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES, MESSAGES } from "../../../common/config";
import BookingAddForm from "./booking-add-form";
import util from "../../../common/util";

@withRouter
@inject("store")
@observer
export default class BookingAddHappyHourForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let happyHourEnabled = this.props.store.settings.happy_hour_enabled;

    if (!happyHourEnabled) {
      return (
        <Alert danger>
          <strong>Oh snap! </strong>
          <span>Happy Hour is not available</span>
        </Alert>
      );
    }

    let peak_season_start_date = moment.utc(this.props.store.settings.peak_season_start_date);
    let peak_season_end_date = moment.utc(this.props.store.settings.peak_season_end_date);
    let current = moment();

    if (!util.isInPeakSeason(current, peak_season_start_date, peak_season_end_date)) {
      return (
        <Alert info>
          <strong>Good news! </strong>
          <span>{MESSAGES.happy_hour_all_day_mid_season}</span>
          <p>
            <Link to={`${URL_CONFIG.user_bookings_path}/new`}>Click here</Link> to start your booking
          </p>
        </Alert>
      );
    } else if (moment().hour() < 16) {
      return (
        <Alert danger>
          <strong>Oh snap! </strong>
          <span>{MESSAGES.happy_hour_not_open}</span>
        </Alert>
      );
    } else {
      return (
        <BookingAddForm
          type="happy_hour"
          image_header={IMAGES.boat_happy_hour}
          header_title="Happy Hour Booking"
          {...this.props}
        />
      );
    }
  }
}
