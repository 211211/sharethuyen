import React from "react";
import Loader from "react-loader";

import { Row } from "@sketchpixy/rubix";

import SimpleImagePreview from "../../_core/simple-image-preview";
import UserEndorsementForm from "../../_core/user/user-endorsement-form";

export default class ProfileEndorsementCustom extends React.Component {
  render() {
    let { user } = this.props;
    return (
      <Row>
        <UserEndorsementForm readonly user={user} />
      </Row>
    );
  }
}
