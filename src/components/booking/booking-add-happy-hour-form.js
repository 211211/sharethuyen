import React from "react";

import BookingAddForm from "./booking-add-form";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class BookingAddHappyHourForm extends React.Component {
  render() {
    let happyHourEnabled = this.props.store.settings.happy_hour_enabled;

    if (happyHourEnabled) {
      return <BookingAddForm type="happy_hour" {...this.props} />;
    } else {
      return <center>Happy hour feature has been disabled</center>;
    }
  }
}
