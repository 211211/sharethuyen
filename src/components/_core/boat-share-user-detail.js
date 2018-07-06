import React from "react";
import { Link, withRouter } from "react-router";
import Select from "react-select";

import { Form, FormGroup, Col, FormControl, ControlLabel } from "@sketchpixy/rubix";

import { CONSTANT, URL_CONFIG } from "../../common/config.js";
import AppUtil from "../../common/util";

@withRouter
export default class BoatShareUserDetail extends React.Component {
  render() {
    const { user } = this.props;
    const { id, email, full_name, membership_type } = user;
    const is_active = typeof user.is_active == "boolean" ? user.is_active : true;
    const balance = user.balance ? user.balance : 0;
    return (
      <Form horizontal className="static-view-form">
        <Col sm={3} componentClass={ControlLabel}>
          Name
        </Col>
        <Col sm={3}>
          <FormControl.Static>{full_name}</FormControl.Static>
        </Col>
        <Col sm={3} componentClass={ControlLabel}>
          Member Class
        </Col>
        <Col sm={3}>
          <FormControl.Static>{membership_type}</FormControl.Static>
        </Col>
        <Col sm={3} componentClass={ControlLabel}>
          Email
        </Col>
        <Col sm={3}>
          <FormControl.Static>
            <Link to={`${URL_CONFIG.users_path}/${id}/edit`}>{email}</Link>
          </FormControl.Static>
        </Col>
        <Col sm={3} componentClass={ControlLabel}>
          Member Status
        </Col>
        <Col sm={3}>
          <FormControl.Static>
            {(() => {
              if (!is_active) {
                return <span style={{ color: "#a94442" }}>Not Active</span>;
              } else {
                return <span>Active</span>;
              }
            })()}
          </FormControl.Static>
        </Col>
        <Col sm={3} componentClass={ControlLabel}>
          Balance
        </Col>
        <Col sm={3}>
          <FormControl.Static>{AppUtil.currencyFormatter().format(balance)}</FormControl.Static>
        </Col>
        <Col sm={6} />
      </Form>
    );
  }
}
