import React from "react";
import Select from "react-select";

import { FormGroup, Col, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../common/config.js";
import SelectUser from "./select-user";
import util from "../../common/util";

export default class SelectUserFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user || "",
      users: [],
      isError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.user = nextProps.user;

    if (this.state.user) {
      newState.isError = false;
    }
    this.setState(newState);
  }

  valid() {
    if (!this.state.user) {
      util.growlError("need_to_select_user_before_creating_booking");
      return false;
    }

    return true;
  }

  render() {
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          User <span className="req-field">*</span>
        </Col>
        <Col sm={6} className={this.state.isError ? "error" : ""}>
          <SelectUser user={this.state.user} {...this.props} />
        </Col>
      </FormGroup>
    );
  }
}
