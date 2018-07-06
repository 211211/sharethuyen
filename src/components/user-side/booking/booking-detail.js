import React from "react";
import { inject, observer } from "mobx-react";

import {
  Row,
  Col,
  Grid,
  Image,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  ModalConfirm
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, IMAGES } from "../../../common/config";
import client from "../../../common/http-client";
import BookingCancelModal from "../../_core/booking/booking-cancel-modal";
import BoatShareUserDetail from "../../_core/boat-share-user-detail";
import HomeRedFlag from "../home/home-red-flag";
import BookingGeneral from "../../_core/booking/booking-general";
import BookingCharge from "../../_core/booking/booking-charge";
import UserSideHeader from "../_core/user-side-header.js";
import AddonDetail from "../../_core/booking/addon/addon-detail";
import BoatDetail from "./boat-detail";

@inject("store", "newBookingStore")
@observer
export default class BookingDetail extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      booking: {
        user_notes: "",
        user: {},
        boat: {},
        charges: [],
        booking_addons: []
      },
      submitDisabled: false
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.user_bookings_path}/${id}`).then(res => {
      var newState = this.state;
      newState.booking = res;
      if (!newState.booking.user_notes) {
        newState.booking.user_notes = "";
      }
      newState.booking.start_date = moment(newState.booking.start_date);
      newState.booking.end_date = moment(newState.booking.end_date);
      this.setState(newState);
      // TODO: Populate to newBookingStore inorder to make add-on component work
      // Later on, should merge those two stores
      this.props.newBookingStore.populate(res, "view");
    });
  }

  onUpdateAddons(booking_addons) {
    this.props.newBookingStore.updateBookingAddons(booking_addons);
    this.refreshCharges();
  }

  refreshAddons() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.user_booking_addons_path}/find_by_booking`, { booking_id: id }).then(res => {
      this.props.newBookingStore.updateBookingAddons(res);
    });
  }

  onCancelBookingFn() {
    this.confirmCancelModal.wrappedInstance.open();
  }

  resolvedCancelBookingFn() {
    this.componentDidMount();
  }

  handleChangeUserNote(user_notes) {
    this.state.booking.user_notes = user_notes;
  }

  handleChangeBookingCharges(charges) {
    let newState = this.state;
    this.state.booking.charges = charges;
    this.setState(newState);
    this.refreshAddons();
  }

  refreshCharges() {
    let { id } = this.props.params;

    //TODO: Refactor by query charge list only
    client.get(`${URL_CONFIG.user_bookings_path}/${id}`).then(res => {
      if (res && res.charges && res.charges.length > 0) {
        var newState = this.state;
        newState.booking.charges = res.charges;
        this.setState(newState);
      }
    });
  }

  render() {
    return (
      <div className="user-side">
        <UserSideHeader />
        <PanelContainer noOverflow className="payment-form" controls={false}>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col xs={12} className="text-center">
                    <Image src={IMAGES.boat} />
                    <h4 className="bshare-primary-color page-title">Make A Booking</h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h3>Booking Detail</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <HomeRedFlag />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Member Details</h4>
                  </Col>
                  <BoatShareUserDetail user={this.state.booking.user} />
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Boat</h4>
                  </Col>
                  <BoatDetail boat={this.state.booking.boat} />
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Add-on</h4>
                  </Col>
                  <AddonDetail
                    booking_addons={this.state.booking.booking_addons}
                    onUpdateAddons={::this.onUpdateAddons}
                    booking={this.state.booking}
                    user_side={true}
                  />
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Booking Detail</h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <BookingGeneral user_side user={this.state.booking.user} booking={this.state.booking} />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Charges</h4>
                  </Col>
                </Row>
                <BookingCharge
                  user_side
                  booking={this.state.booking}
                  pending_charge_message={this.props.store.settings.pending_charge_message}
                  refreshCharges={::this.refreshCharges}
                  handleChangeBookingCharges={::this.handleChangeBookingCharges}
                />
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Notes</h4>
                  </Col>
                  <Col sm={3} />
                  <Col sm={9}>
                    <p>
                      {this.state.booking.user_notes.split("\n").map(function(item, index) {
                        return (
                          <span key={index}>
                            {item} <br />
                          </span>
                        );
                      })}
                    </p>
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
            <PanelFooter className="text-right">
              <Grid>
                <Row>
                  <Col md={12}>
                    <br />
                    <div>
                      {(() => {
                        if (
                          this.state.booking.status == CONSTANT.BOOKING_STATUS.tba ||
                          this.state.booking.status == CONSTANT.BOOKING_STATUS.confirmed
                        ) {
                          return (
                            <Button outlined bsStyle="danger" onClick={::this.onCancelBookingFn}>
                              Cancel Booking
                            </Button>
                          );
                        }
                      })()}
                      <BookingCancelModal
                        user_side
                        ref={c => (this.confirmCancelModal = c)}
                        booking={this.state.booking}
                        resolvedFn={::this.resolvedCancelBookingFn}
                      />
                    </div>
                    <br />
                  </Col>
                </Row>
              </Grid>
            </PanelFooter>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
