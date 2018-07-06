import React from "react";
import { withRouter, Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer, Button, Image } from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES, MESSAGES, CONSTANT } from "../../../common/config";
import util from "../../../common/util";
import ModalAlert from "../../_core/modal-alert";
import HomeNotInPeakSeasonModal from "./home-not-in-peak-season-modal";

@withRouter
@inject("store")
@observer
export default class HomeMainAction extends React.Component {
  goToNewHappyHourBooking() {
    let peak_season_start_date = moment.utc(this.props.store.settings.peak_season_start_date);
    let peak_season_end_date = moment.utc(this.props.store.settings.peak_season_end_date);

    let current = moment();

    if (!util.isInPeakSeason(current, peak_season_start_date, peak_season_end_date)) {
      this.notInPeakSeasonModal.open();
    } else if (this.happyHourCloseForToday()) {
      this.happyHourNotAvailableAlert.open();
    } else if (moment().hour() < 16) {
      // In peak season but before 4PM
      this.happyHourHaventOpenAlert.open();
    } else if ((moment().hour() == 17 && moment().minutes() > 45) || moment().hour() > 17) {
      // In peak season but after 5:45PM
      this.happyHourClosedAlert.open();
    } else {
      this.props.router.push(`${URL_CONFIG.user_bookings_path}/new_happy_hour`);
    }
  }

  happyHourCloseForToday() {
    const { last_reservation_by_date } = this.props.store.settings;
    const dayIndex = moment().day();
    const reservationTime = last_reservation_by_date[CONSTANT.dayOfWeekIndex[dayIndex]];
    if (reservationTime < util.convertTimeToSec("04:00pm")) {
      return true;
    }
  }

  render() {
    let happyHourEnabled = this.props.store.settings.happy_hour_enabled;
    let happyHourButton = happyHourEnabled ? (
      <Link style={{ cursor: "pointer" }} onClick={::this.goToNewHappyHourBooking}>
        <Image src={IMAGES.happy_hour_booking} className="action-icon img-responsive" />
      </Link>
    ) : null;

    return (
      <PanelContainer controls={false}>
        <Panel>
          <PanelBody style={{ padding: 20 }}>
            <Grid>
              <Row>
                <Col className="home-actions row">
                  <Link to={`${URL_CONFIG.user_bookings_path}/new`}>
                    <Image src={IMAGES.make_a_booking} className="action-icon img-responsive" />
                  </Link>
                  {happyHourButton}
                  <Link to={`${URL_CONFIG.profile_user_path}`}>
                    <Image src={IMAGES.profile_icon} className="action-icon img-responsive" />
                  </Link>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>

        <ModalAlert message={MESSAGES.happy_hour_not_open} ref={c => (this.happyHourHaventOpenAlert = c)} />
        <ModalAlert
          message="Sorry, Happy Hour is closed for today. For future reference, Happy Hour starts at 4pm and closes at 5:45pm"
          ref={c => (this.happyHourClosedAlert = c)}
        />
        <ModalAlert
          message="Sorry, Happy Hour is not open for today. Please contact us for more information."
          ref={c => (this.happyHourNotAvailableAlert = c)}
        />
        <HomeNotInPeakSeasonModal ref={c => (this.notInPeakSeasonModal = c)} />
      </PanelContainer>
    );
  }
}
