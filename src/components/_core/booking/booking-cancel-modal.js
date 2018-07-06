import React from "react";
import { inject } from "mobx-react";

import { Button, Modal } from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import AppUtil from "../../../common/util";
import client from "../../../common/http-client";

@inject("store")
export default class BookingCancelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      okDisabled: false,
      loaded: true,
      showModal: false,
      refundAmount: 0,
      autoFeeAmount: 0
    };
  }

  close() {
    var newState = this.state;
    newState.showModal = false;
    this.setState(newState);
  }

  open() {
    const { booking } = this.props;
    let { id, booking_type } = booking;
    const isAdminLessonBooking =
      booking_type == CONSTANT.bookingType.lesson_use || booking_type == CONSTANT.bookingType.admin_use;
    if (isAdminLessonBooking) {
      this.setState({
        showModal: true,
        refundAmount: 0,
        autoFeeAmount: 0
      });
      return;
    }
    this.setState({
      loaded: false,
      showModal: true,
      refundAmount: 0,
      autoFeeAmount: 0
    });
    let calculate_refund_amount_url = `${URL_CONFIG.bookings_path}/${id}/calculate_refund_amount`;
    if (this.props.user_side) {
      calculate_refund_amount_url = `${URL_CONFIG.user_bookings_path}/${id}/calculate_refund_amount`;
    }
    client.get(calculate_refund_amount_url).then(
      res => {
        this.setState({
          loaded: true,
          refundAmount: res.refund,
          autoFeeAmount: res.auto_fee
        });
      },
      res => {
        this.setState({
          loaded: true
        });
      }
    );
  }

  setLoading(isLoading) {
    this.setState({
      okDisabled: isLoading,
      loaded: !isLoading
    });
  }

  resolvedCancelBookingFn() {
    this.setLoading(true);
    let booking_id = this.props.booking.id;

    let cancel_url = `${URL_CONFIG.bookings_path}/${booking_id}/cancel`;
    if (this.props.user_side) {
      cancel_url = `${URL_CONFIG.user_bookings_path}/${booking_id}/cancel`;
    }
    client.post(cancel_url).then(
      response => {
        if (response.user && response.user.balance) {
          this.props.store.updateUserBalance(response.user.balance);
        }

        this.setLoading(false);
        this.setState({
          showModal: false
        });

        this.props.resolvedFn();
      },
      response => {
        this.setLoading(false);
      }
    );
  }

  render() {
    const { refundAmount, autoFeeAmount, loaded, showModal, okDisabled } = this.state;
    const { cancellation_policy } = this.props.store.settings;
    return (
      <Modal show={showModal} onHide={::this.close} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Loader loaded={loaded} />
          <p>Do you want to Cancel this Booking?</p>
          {loaded && (
            <div>
              {refundAmount == 0 ? (
                <p>
                  <em>No dock fee will be refunded!</em>
                </p>
              ) : (
                <p>
                  <em>{AppUtil.currencyFormatter().format(refundAmount)} will be refunded!</em>
                </p>
              )}
            </div>
          )}
          {autoFeeAmount > 0 && (
            <p>
              <em>You will be charged a cancellation fee of {AppUtil.currencyFormatter().format(autoFeeAmount)}</em>
            </p>
          )}
          {_.isString(cancellation_policy) &&
            cancellation_policy.length > 0 && (
              <div>
                <p style={{ fontWeight: "bold", fontSize: 16 }}>Cancellation Policy</p>
                <p>{cancellation_policy}</p>
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={::this.close} bsStyle="default">
            Close
          </Button>
          <Button onClick={::this.resolvedCancelBookingFn} bsStyle="primary" disabled={okDisabled}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
