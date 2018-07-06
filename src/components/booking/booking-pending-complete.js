import React from "react";

import BookingComplete from "./booking-complete";

export default class BookingPendingComplete extends React.Component {
  render() {
    return <BookingComplete check_in_boat {...this.props} />;
  }
}
