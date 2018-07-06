import React from "react";

import { Row, Col, Form, FormGroup, ControlLabel } from "@sketchpixy/rubix";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import SelectUserFormGroup from "../../select-user-form-group";
import SelectBoatClassFormGroup from "../../select-boat-class-form-group";

@inject("store", "newBookingStore")
@observer
export default class UserBoatClass extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }
  render() {
    const { user, boat_class, mode } = this.booking;
    const { current_user, user_side } = this.props;
    if (mode == "edit") {
      return (
        <Row>
          <Col md={8} mdPush={2}>
            <Form horizontal>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  User
                </Col>
                <Col sm={6}>{user.email}</Col>
              </FormGroup>
              <FormGroup>
                <Col sm={3} componentClass={ControlLabel}>
                  Boat Class
                </Col>
                <Col sm={6}>{boat_class.name}</Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col md={8} mdPush={2}>
            <Form horizontal>
              <SelectUserFormGroup
                user={user}
                current_user={current_user}
                onChangeUser={::this.onChangeUser}
                ref={c => (this.selectUser = c)}
              />
              <SelectBoatClassFormGroup
                user_side={user_side}
                boat_class={this.booking.boat_class}
                current_user={current_user}
                ref={c => (this.selectBoatClass = c)}
              />
            </Form>
          </Col>
        </Row>
      );
    }
  }

  onChangeUser(user) {
    if (user && user.id) {
      this.booking.user = user;
      if (user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited) {
        this.booking.discount_percent = 100;
      } else {
        this.booking.discount_percent = 0;
      }
      this.booking.clearAmountDetail();
      this.selectBoatClass.wrappedInstance.disableBoatClasses(user.boat_class_ids);
    } else {
      this.booking.user = {};
    }
    this.checkAndEnableSubmit();
  }
}
