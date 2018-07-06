import React from "react";
import Loader from "react-loader";

import { Form, Row, Col, FormGroup, FormControl, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG } from "../../../common/config";
import client from "../../../common/http-client";
import SimpleImagePreview from "../../_core/simple-image-preview";
import UserUtil from "../../user/user-util";
import ProfileEndorsementLicense from "./profile-endorsement-license";
import ProfileEndorsementClass from "./profile-endorsement-class";
import ProfileEndorsementCustom from "./profile-endorsement-custom";

export default class ProfileEndorsement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: UserUtil.mapUserEndorsementState({}),
      loaded: false
    };
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.profile_endorsement_user_path}`).then(res => {
      let newState = this.state;
      newState.user = UserUtil.mapUserEndorsementState(res);
      newState.loaded = true;
      this.setState(newState);
    });
  }

  render() {
    let { user } = this.state;
    let { boat_classes } = user;
    return (
      <div>
        <Loader loaded={this.state.loaded} />
        {(() => {
          if (user && user.id) {
            return (
              <div>
                <ProfileEndorsementClass user={user} />
                <ProfileEndorsementLicense user={user} />
                <ProfileEndorsementCustom user={user} />
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
