import React from "react";
import { Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";

@inject("store")
@observer
export default class HomeWeekendBookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekend_bookings: [],
      weekend_bookings_count: 0,
      max_weekend_bookings: 0
    };
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.profile_weekend_bookings_path}`).then(res => {
      this.setState({
        weekend_bookings: res.weekend_bookings,
        weekend_bookings_count: res.weekend_bookings_count,
        max_weekend_bookings: res.max_weekend_bookings
      });
    });
  }

  render() {
    let user = this.props.store.user;

    if (
      user.membership_type === CONSTANT.MEMBERSHIP_TYPE.mid_week ||
      user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily
    )
      return null;

    let availableSlots = [];
    for (let i = 0; i < this.state.max_weekend_bookings - this.state.weekend_bookings_count; i++) {
      availableSlots.push(
        <span key={i} className="weekend-booking-available">
          AVAILABLE
        </span>
      );
    }

    let text =
      user.membership_type !== CONSTANT.MEMBERSHIP_TYPE.shared
        ? "YOUR WEEKEND/HOLIDAY BOOKINGS"
        : "YOUR GROUP'S WEEKEND/HOLIDAY BOOKINGS";
    return (
      <PanelContainer controls={false}>
        <Panel>
          <PanelBody style={{ padding: 20 }}>
            <Grid>
              <Row className="home-actions weekend-bookings">
                <Col sm={12} className="text-center">
                  {text}
                  {this.state.weekend_bookings.map(booking => {
                    if (parseInt(user_id) === booking.user.id) {
                      return (
                        <Link key={booking.id} to={`${URL_CONFIG.user_bookings_path}/${booking.id}`}>
                          <span className="weekend-booking">
                            #{booking.id} {user_role === "shared_group" ? ` - ${booking.user.full_name}` : ""}
                          </span>
                        </Link>
                      );
                    } else {
                      return (
                        <span key={booking.id} className="weekend-booking">
                          #{booking.id} {user_role === "shared_group" ? ` - ${booking.user.full_name}` : ""}
                        </span>
                      );
                    }
                  })}
                  {availableSlots}
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
