import React from "react";
import { Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer, Icon } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";

@inject("store")
@observer
export default class HomeRedFlag extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.store.user;

    const red_flag = user.red_flag;

    if (Object.keys(red_flag).length === 0) return null;

    let flags =
      Object.keys(red_flag).length > 0 ? (
        <Row className="user-side-redflag">
          <Col sm={6} smOffset={3} style={{ border: "1px solid #D71F4B", paddingTop: 12.25 }}>
            <center>Please note: You must have these completed before you can take a boat out on the water.</center>
            {Object.keys(red_flag).map((red_flag_item, index) => {
              return <RedFlagItem key={index} type={red_flag_item} />;
            })}
          </Col>
        </Row>
      ) : null;

    return (
      <PanelContainer controls={false}>
        <Panel>
          <PanelBody style={{ padding: 20 }}>
            <Grid>{flags}</Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}

class RedFlagItem extends React.Component {
  render() {
    let message;
    switch (this.props.type) {
      case "need_security_deposit":
        return (
          <p className="flag-item">
            <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
            <span>
              Pay security deposit -{" "}
              <Link to={{ pathname: URL_CONFIG.profile_user_path, query: { active_tab: "billing" } }}>pay here</Link>
            </span>
          </p>
        );
        break;
      case "need_wa_state_marine_photo":
        return (
          <p className="flag-item">
            <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
            <span>
              Add WA State Boaters card -{" "}
              <a href="http://boatus.org/washington/" target="_blank">
                get yours here
              </a>
            </span>
          </p>
        );
        break;
      case "need_driver_license_photo":
        return (
          <p className="flag-item">
            <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
            <span>Add Driver License - licences can be added during your dock checkout</span>
          </p>
        );
        message = "Need to add Driver License";
        break;
      case "need_field_required":
        return (
          <p className="flag-item">
            <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
            <span>
              <Link to={{ pathname: URL_CONFIG.profile_user_path, query: { active_tab: "endorsements" } }}>
                Finish all required fields in Endorsement list
              </Link>
            </span>
          </p>
        );
        break;
      default:
    }
  }
}
