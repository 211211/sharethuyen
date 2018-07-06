import React from "react";
import ReactDOM from "react-dom";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

import UserCardList from "./user-card-list";

export default class GroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      maxUser: this.getMaxUserNum(props.group.membership_type)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      group: nextProps.group,
      maxUser: this.getMaxUserNum(nextProps.group.membership_type)
    });
  }

  handleChangeName(e) {
    this.props.parent.handleFieldChange("name", e.target.value);
  }

  onMouseSelectType(e) {
    var membership_type = e.target.value;
    this.props.parent.handleFieldChange("membership_type", membership_type);
  }

  getMaxUserNum(membership_type) {
    //Temporary hard-coded, should move to configuration page
    var maxUser = 4;
    if (membership_type == "coporate") {
      maxUser = 100;
    }
    return maxUser;
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Membership Type
          </Col>
          <Col sm={9}>
            <FormControl
              componentClass="select"
              placeholder="select"
              disabled={this.props.mode == "edit"}
              value={this.state.group.membership_type}
              onChange={::this.onMouseSelectType}
            >
              <option value="shared">Shared Group</option>
              <option value="coporate">Coporate</option>
            </FormControl>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              placeholder="Name"
              autoFocus
              value={this.state.group.name}
              onChange={::this.handleChangeName}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Members
          </Col>
          <Col sm={9}>
            <UserCardList
              maxUser={this.state.maxUser}
              onRemoveUser={this.props.onRemoveUser}
              onAddNewUser={this.props.onAddNewUser}
              users={this.props.group.users}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
