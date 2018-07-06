import React from "react";
import { Row, Col, Button } from "@sketchpixy/rubix";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { isInteger } from "lodash";
import reactCSS from "reactcss";

import { CONSTANT, URL_CONFIG } from "../../../../common/config";
import ModalConfirm from "../../modal-confirm";

/**
 * Current used as footer in booking edit page. Later on, will be used in BookingForm for Admin/User/Happy Hour booking
 */
@inject("store", "newBookingStore")
@observer
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmitFn = this.onSubmitFn.bind(this);
    this.onResolveConfirmNote = this.onResolveConfirmNote.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChangeBookingMode = this.handleChangeBookingMode.bind(this);
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  render() {
    const { booking, onSubmitFn, onResolveConfirmNote, handleCheckbox, handleChangeBookingMode } = this;
    const { submitDisabled } = this.props;
    const { user_side } = this.props.store;
    const { is_admin_override, return_before, booking_type } = booking;
    const isEditMode = booking && booking.id;
    const confirmNotes = this.getConfirmNotes();

    // Need user confirm on return the boat early
    const termAgreeCheck = isInteger(return_before);

    const styles = reactCSS({
      default: {
        label: { marginBottom: 0, fontWeight: "normal" },
        bookingTypeWrap: {
          display: "flex",
          flexDirection: "row-reverse",
          marginBottom: 0
        },
        bookingType: {
          marginLeft: 10,
          fontWeight: "normal"
        }
      }
    });
    return (
      <Row className="text-right">
        <Col md={12}>
          {!user_side && (
            <div className="text-right">
              <label style={styles.label}>
                <small>
                  Admin Override: No permission restrictions?
                  <input
                    name="is_admin_override"
                    checked={is_admin_override}
                    onChange={handleCheckbox}
                    type="checkbox"
                    style={{ marginLeft: 5 }}
                  />
                </small>
              </label>
              <p style={styles.bookingTypeWrap}>
                <label style={styles.bookingType}>
                  <input
                    type="radio"
                    name="admin_use"
                    checked={booking_type == CONSTANT.bookingType.admin_use}
                    onChange={handleChangeBookingMode}
                  />{" "}
                  <small>Admin Use</small>
                </label>
                <label style={styles.bookingType}>
                  <input
                    type="radio"
                    name="lesson_use"
                    checked={booking_type == CONSTANT.bookingType.lesson_use}
                    onChange={handleChangeBookingMode}
                  />{" "}
                  <small>Lesson Use</small>
                </label>
                <label style={styles.bookingType}>
                  <input
                    type="radio"
                    name="normal"
                    checked={booking_type == CONSTANT.bookingType.normal}
                    onChange={handleChangeBookingMode}
                  />{" "}
                  <small>Default</small>
                </label>
              </p>
            </div>
          )}
          <div className="text-right">
            <small>
              {!isEditMode && <i>* Click to make payment and confirm your booking</i>}
              {isEditMode && <i>* Click to make payment and update your booking</i>}
            </small>
          </div>
          <div>
            <Button outlined bsStyle="default" onClick={::this.onCancelFn}>
              Cancel
            </Button>{" "}
            <Button outlined bsStyle="primary" onClick={onSubmitFn} disabled={submitDisabled}>
              {isEditMode ? "PAY & UPDATE BOOKING" : "PAY & CONFIRM BOOKING"}
            </Button>
          </div>
          <br />
        </Col>
        <ModalConfirm
          termAgreeCheck={termAgreeCheck}
          message={confirmNotes}
          ref={c => (this.confirmNotes = c)}
          resolvedFn={onResolveConfirmNote}
        />
      </Row>
    );
  }

  getConfirmNotes() {
    let messages = [];
    const { system_notes, booking_addons } = this.booking;
    if (system_notes && system_notes.length > 0) {
      messages.push(system_notes);
    }
    const addonMsg = this.buildBookingAddonMsg();
    if (addonMsg && addonMsg.length > 0) {
      messages.push(addonMsg);
    }
    if (messages.length > 0) {
      return (
        <div>
          {messages.map(message => {
            return <div>{message}</div>;
          })}
        </div>
      );
    }
  }

  buildBookingAddonMsg() {
    const { charges } = this.booking;
    if (charges && charges.length > 0) {
      const eCommerceSucceededCharges = charges.filter(charge => {
        return (
          charge.charge_type === CONSTANT.CHARGE_TYPE.e_commerce.key &&
          charge.status === CONSTANT.CHARGE_STATUS.succeeded
        );
      });
      if (eCommerceSucceededCharges.length > 0) {
        return "Booking extras item(s) will be cancelled. You will need to re-add those manually!";
      }
    }
  }

  onSubmitFn() {
    if (this.getConfirmNotes()) {
      this.confirmNotes.open();
    } else {
      this.props.onSubmitFn();
    }
  }

  onResolveConfirmNote() {
    this.confirmNotes.close();
    this.props.onSubmitFn();
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.bookings_path);
  }

  handleCheckbox(e) {
    const { name, checked } = e.target;
    this.booking[name] = checked;
  }

  handleChangeBookingMode(e) {
    const { name } = e.currentTarget;
    this.booking.booking_type = name;
  }
}
