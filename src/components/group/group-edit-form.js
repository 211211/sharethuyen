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

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";
import BoatShareForm from "../_core/boat-share-form";
import GroupForm from "./group-form";
import GroupUtil from "./group-util";

export default class GroupEditForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      group: {
        id: "",
        name: "",
        membership_type: "",
        users: []
      }
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.groups_path}/${id}`).then(res => {
      this.setState({
        group: {
          id: res.id,
          name: res.name || "",
          membership_type: res.membership_type || "",
          users: res.users || []
        }
      });
    });
  }

  onSubmitFn() {
    this.setState({
      errors: {}
    });
    this.boatShareForm.setSubmitDisable(true);
    var submitGroup = GroupUtil.buildSubmitGroup(this.state.group);
    client.put(`${URL_CONFIG.groups_path}/${this.props.params.id}`, submitGroup).then(
      res => {
        this.boatShareForm.setSubmitDisable(false);
        if (res && res.add_users_messages.length > 0) {
          res.add_users_messages.map(message => {
            util.growlError(message);
          });
        }
        this.props.router.push(URL_CONFIG.groups_path);
      },
      response => {
        this.boatShareForm.setSubmitDisable(false);
        if (response.status == 400) {
          if (response.status == 400) {
            var resObj = response.responseJSON;
            this.setState({ errors: resObj.errors });
          }
        }
      }
    );
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.groups_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.group[fieldId] = value;
    this.setState(newState);
  }

  onAddNewUser(user) {
    var newState = this.state;
    newState.group.users.push(user);
    this.setState(newState);
  }

  onRemoveUser(user) {
    var newState = this.state;
    var users = newState.group.users;
    users.splice(users.indexOf(user), 1);
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Edit Group"
        submitBtn="Save"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <GroupForm
          mode="edit"
          parent={this}
          onAddNewUser={::this.onAddNewUser}
          onRemoveUser={::this.onRemoveUser}
          group={this.state.group}
        />
      </BoatShareForm>
    );
  }
}
