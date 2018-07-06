import React from "react";
import { inject, observer } from "mobx-react";

import { PanelContainer, Panel, PanelBody, Grid, Row, Col, Image } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, IMAGES } from "../../../common/config";
import client from "../../../common/http-client";
import BookingAddFormCore from "../../_core/booking/booking-add-form";
import UserSideHeader from "../_core/user-side-header.js";

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
        .post(URL_CONFIG.user_bookings_path, {
          booking: {
            boat_class_id: booking.boat_class.id,
            start_date: booking.start_date.format(CONSTANT.DATE_FORMAT),
            end_date: booking.end_date.format(CONSTANT.DATE_FORMAT),
            booking_type: booking.booking_type,
            payment_methods: booking.payment_methods,
            departure_time: booking.departure_time,
            user_notes: booking.user_notes,
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
            if (res.user && res.user.balance) {
              this.props.store.updateUserBalance(res.user.balance);
            }
            this.props.store.cleanPayment();
            let id = res.booking.id;
            this.props.router.push(`${URL_CONFIG.user_bookings_path}/${id}`);
          },
          response => {
            this.bookingAddFormCore.wrappedInstance.setSubmitDisable(false);
          }
        );
    }
  }

  render() {
    const { user, settings } = this.props.store;

    let intro_msg = this.props.type === "happy_hour" ? settings.ui_booking_hh_intro : settings.ui_booking_intro;

    let image_header = this.props.image_header || IMAGES.boat;
    let header_title = this.props.header_title || "Make A Booking";
    return (
      <div className="user-side">
        <UserSideHeader />
        <PanelContainer noOverflow controls={false}>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col xs={12} className="text-center">
                    <Image src={image_header} />
                    <h4 className="bshare-primary-color page-title">{header_title}</h4>
                    <p>{intro_msg}</p>
                  </Col>
                </Row>
              </Grid>
              <BookingAddFormCore
                user_side
                ref={c => {
                  this.bookingAddFormCore = c;
                }}
                onSubmitFn={::this.onSubmitFn}
                current_user={user}
                type={this.props.type}
              />
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
