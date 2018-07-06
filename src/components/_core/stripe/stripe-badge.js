import React from "react";
import { Image } from "@sketchpixy/rubix";

import { IMAGES } from "../../../common/config";

export default class StripeBadge extends React.Component {
  render() {
    return (
      <a target="_blank" href="https://stripe.com">
        <Image src={IMAGES.powered_by_stripe_icon} />
      </a>
    );
  }
}
