import React from "react";

import { Col, FormGroup, FormControl, ControlLabel } from "@sketchpixy/rubix";

export default class SettingMessage extends React.Component {
  render() {
    const {
      handleChangeValue,
      pending_charge_message,
      ui_booking_intro,
      ui_booking_hh_intro,
      t_and_c_on_check_out,
      cancellation_policy,
      no_show_cancel_fee_unlimited_msg,
      cancel_fee_unlimited_msg,
      no_show_fee_msg
    } = this.props;
    return (
      <div>
        <Col md={12}>
          <h4 className="section-form-title">Messages</h4>
        </Col>
        <MessageFormGroup
          label="Pending Charge Message"
          name="pending_charge_message"
          value={pending_charge_message}
          onChange={handleChangeValue}
        />
        <MessageFormGroup
          label="UI Booking Intro"
          name="ui_booking_intro"
          value={ui_booking_intro}
          onChange={handleChangeValue}
        />
        <MessageFormGroup
          label="UI Booking Happy Hour Intro"
          name="ui_booking_hh_intro"
          value={ui_booking_hh_intro}
          onChange={handleChangeValue}
        />
        <MessageFormGroup
          label="T&C on Checkout"
          name="t_and_c_on_check_out"
          value={t_and_c_on_check_out}
          onChange={handleChangeValue}
        />
        <MessageFormGroup
          label="Cancellation Policy"
          name="cancellation_policy"
          value={cancellation_policy}
          onChange={handleChangeValue}
          hint="Used in cancel booking modal"
        />
        <MessageFormGroup
          label="No Show + Cancel Fee - Unlimited"
          name="no_show_cancel_fee_unlimited_msg"
          value={no_show_cancel_fee_unlimited_msg}
          onChange={handleChangeValue}
          hint="Used in creating Transaction and sending email"
        />
        <MessageFormGroup
          label="Cancel Fee - Unlimited"
          name="cancel_fee_unlimited_msg"
          value={cancel_fee_unlimited_msg}
          onChange={handleChangeValue}
          hint="Used in creating Transaction and sending email"
        />
        <MessageFormGroup
          label="No Show Fee"
          name="no_show_fee_msg"
          value={no_show_fee_msg}
          onChange={handleChangeValue}
          hint="Used in creating Transaction and sending email"
        />
      </div>
    );
  }
}

class MessageFormGroup extends React.Component {
  render() {
    const { label, name, value, onChange, hint } = this.props;
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl componentClass="textarea" rows="3" name={name} value={value} onChange={onChange} />
          <small>{hint}</small>
        </Col>
      </FormGroup>
    );
  }
}
