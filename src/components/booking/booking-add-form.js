import React from "react";
import { inject, observer } from "mobx-react";
import { PanelContainer, Panel, PanelBody } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import BookingAddFormCore from "../_core/booking/booking-add-form";

@inject("store")
@observer
export default class BookingAddForm extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmitFn() {
    if (this.bookingAddFormCore.wrappedInstance.isValidForSubmit()) {
      this.bookingAddFormCore.wrappedInstance.setSubmitDisable(true);
      let booking = this.bookingAddFormCore.wrappedInstance.getBooking();
      client
        .post(URL_CONFIG.bookings_path, {
          booking: {
            user_id: booking.user.id,
            boat_class_id: booking.boat_class.id,
            start_date: booking.start_date.format(CONSTANT.DATE_FORMAT),
            end_date: booking.end_date.format(CONSTANT.DATE_FORMAT),
            booking_type: booking.booking_type,
            payment_methods: booking.payment_methods,
            departure_time: booking.departure_time,
            discount_percent: booking.discount_percent || 0,
            discount_notes: booking.discount_notes,
            user_notes: booking.user_notes,
            is_admin_override: booking.is_admin_override,
            system_notes: booking.system_notes,
            booking_addons_attributes: booking.booking_addons.map(booking_addon => {
              return {
                addon_id: booking_addon.addon.id,
                quantity: booking_addon.quantity
              };
            })
          }
        })
        .then(
          res => {
            this.bookingAddFormCore.wrappedInstance.setSubmitDisable(false);
            let id = res.id;
            this.props.store.cleanPayment();
            this.props.router.push(`${URL_CONFIG.bookings_path}/${id}`);
          },
          response => {
            this.bookingAddFormCore.wrappedInstance.setSubmitDisable(false);
          }
        );
    }
  }

  render() {
    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <BookingAddFormCore
              ref={c => {
                this.bookingAddFormCore = c;
              }}
              onSubmitFn={::this.onSubmitFn}
              type={this.props.type}
            />
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
