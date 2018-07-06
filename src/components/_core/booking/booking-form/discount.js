import React from "react";

import { Row, Col, Form, FormGroup, ControlLabel, FormControl } from "@sketchpixy/rubix";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";

@inject("store", "newBookingStore")
@observer
export default class Discount extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  render() {
    const { user, boat_class, mode } = this.booking;
    const { user_side } = this.props.store;
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Discount</h4>
        </Col>
        <Col md={6} mdOffset={3}>
          <Form horizontal>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Discount Percent
              </Col>
              <Col sm={9}>
                <FormControl
                  type="number"
                  min={0}
                  max={99}
                  value={this.booking.discount_percent}
                  onChange={::this.handleChangeDiscountPercent}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Discount Amount
              </Col>
              <Col sm={9}>
                <FormControl
                  type="number"
                  min={0}
                  max={this.booking.amount}
                  value={this.booking.discount_amount}
                  onChange={::this.handleChangeDiscountAmount}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Discount Notes {!user_side && <span className="label label-warning">Public</span>}
              </Col>
              <Col sm={9}>
                <FormControl
                  placeholder="Discount Notes"
                  componentClass="textarea"
                  rows="3"
                  value={this.booking.discount_notes}
                  onChange={::this.handleChangeDiscountNotes}
                />
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }

  handleChangeDiscountPercent(e) {
    if (e.target.value < 0) {
      this.booking.discount_percent = 0;
    } else if (e.target.value > 100) {
      this.booking.discount_percent = 100;
    } else {
      this.booking.discount_percent = e.target.value;
    }
  }

  handleChangeDiscountAmount(e) {
    if (e.target.value < 0) {
      this.booking.discount_amount = 0;
    } else if (e.target.value > this.booking.amount) {
      this.booking.discount_amount = this.booking.amount;
    } else {
      this.booking.discount_amount = e.target.value;
    }
  }

  handleChangeDiscountNotes(e) {
    this.booking.discount_notes = e.target.value;
  }
}
