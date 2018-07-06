import React from "react";

import UserSideHeader from "../_core/user-side-header";
import HomeRedFlag from "./home-red-flag";
import HomeMainAction from "./home-main-action";
import HomeFooter from "./home-footer";
import HomeWelcome from "./home-welcome";
import HomeRenewalMessage from "./home-renewal-message";
import HomeWeekendBookings from "./home-weekend-bookings";
import util from "../../../common/util";

export default class Home extends React.Component {
  componentDidMount() {
    if (location.href.endsWith("dashboard_confirmed")) {
      util.growl("email_has_been_confirmed");
    }
  }

  render() {
    return (
      <div className="user-side">
        <HomeRenewalMessage />
        <HomeWelcome />
        <UserSideHeader />
        <HomeWeekendBookings />
        <HomeRedFlag />
        <HomeMainAction />
        <HomeFooter />
      </div>
    );
  }
}
