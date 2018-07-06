import React from "react";
import ReactDOM from "react-dom";

import { Image } from "@sketchpixy/rubix";

import { IMAGES } from "../../common/config";
export default class SimpleImagePreview extends React.Component {
  componentDidMount() {
    var linkEl = ReactDOM.findDOMNode(this.link);
    if (linkEl) {
      linkEl.onclick = e => {
        e.preventDefault();
        blueimp.Gallery([linkEl]);
      };
    }
  }

  render() {
    let { image_url } = this.props;
    let { image_thumb_url } = this.props;
    if (image_thumb_url && image_thumb_url.length > 0) {
      return (
        <a ref={c => (this.link = c)} href={image_url}>
          <Image responsive src={image_thumb_url} />
        </a>
      );
    } else {
      return <Image responsive src={IMAGES.no_image} />;
    }
  }
}
