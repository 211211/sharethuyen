import React from "react";
import { Link, withRouter } from "react-router";

import { URL_CONFIG, IMAGES } from "../../../common/config";
import client from "../../../common/http-client";
import Profile from "./profile";

@withRouter
export default class ProfileJoinGroup extends React.Component {
  constructor(props) {
    super(props);

    let group_id = props.params.id;
    client.post(`${URL_CONFIG.user_groups_path}/${group_id}/join`);
  }

  render() {
    return <Profile />;
  }
}
