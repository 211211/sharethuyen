import React from "react";

import { Col, Image, Button } from "@sketchpixy/rubix";

import UserCardForm from "./user-card-form";
import UserCardItem from "./user-card-item";

export default class UserCardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      users: nextProps.users
    });
  }

  onAddNewUser(user) {
    this.props.onAddNewUser(user, this.props.users);
  }

  onRemoveUser(user) {
    this.props.onRemoveUser(user, this.props.users);
  }

  render() {
    let { users } = this.state;
    let usersExist = users && typeof users.map == "function";
    let canAddMoreUser =
      //maxUser was not set, mean unlimited number
      typeof this.props.maxUser == "undefined" ||
      //user list is empty
      typeof this.props.users == "undefined" ||
      typeof this.props.users.length == 0 ||
      //number of current user is not reach max number
      this.props.maxUser > users.length;

    return (
      <div>
        {usersExist &&
          users.map((user, index) => {
            return <UserCardItem key={index} onRemoveUser={::this.onRemoveUser} user={user} />;
          })}
        {canAddMoreUser &&
          (() => {
            return <UserCardForm onAddNewUser={::this.onAddNewUser} />;
          })()}
      </div>
    );
  }
}
