import React from "react";

import { Col, Image, Button } from "@sketchpixy/rubix";

import SelectUser from "../_core/select-user";
import { URL_CONFIG } from "../../common/config";

export default class UserCardForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowAddUserForm: false
    };
  }

  showAddUserForm() {
    var newState = this.state;
    newState.isShowAddUserForm = true;
    this.setState(newState);
  }

  onChangeUser(val) {
    this.props.onAddNewUser(val);
    var newState = this.state;
    newState.isShowAddUserForm = false;
    this.setState(newState);
  }

  render() {
    if (this.state.isShowAddUserForm) {
      return (
        <Col md={4}>
          <div className="user-card-simple">
            <SelectUser search_url={URL_CONFIG.search_users_not_belong_group_path} onChangeUser={::this.onChangeUser} />
          </div>
        </Col>
      );
    } else {
      return (
        <Col md={4}>
          <div className="user-card-simple">
            <Button outlined bsStyle="info" style={{ marginTop: 6 }} onClick={::this.showAddUserForm}>
              Add User
            </Button>
          </div>
        </Col>
      );
    }
  }
}
