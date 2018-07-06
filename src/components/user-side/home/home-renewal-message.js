import React from "react";
import { Link } from "react-router";
import { inject, observer } from "mobx-react";

import { Row, Col, Grid, Panel, PanelBody, PanelContainer, Icon } from "@sketchpixy/rubix";

import { CONSTANT } from "../../../common/config";

@inject("store")
@observer
export default class HomeRenewalMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const user = this.props.store.user;
    const settings = this.props.store.settings;

    let isDailyUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;
    let isUnlimited = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;

    if (isDailyUser || isUnlimited) {
      return null;
    }

    let today = moment();
    let expireOn = moment(user.membership_valid_until, "MM/DD/YYYY");
    let tier1BeforeDay = parseInt(settings.tier_1_before_day);
    let tier2AfterDay = parseInt(settings.tier_2_after_day);

    let tier1StartDay = moment(user.membership_valid_until, "MM/DD/YYYY").subtract(tier1BeforeDay, "days");
    let tier2EndDay = moment(user.membership_valid_until, "MM/DD/YYYY").add(tier2AfterDay, "days");

    let isInTier1 = today >= tier1StartDay && today < expireOn;
    let isInTier2 = today >= expireOn && today < tier2EndDay;

    if (!isInTier1 && !isInTier2) {
      return null;
    }

    let message = "";
    if (user.membership_type === CONSTANT.MEMBERSHIP_TYPE.full) {
      message = isInTier1 ? settings.single_user_renewal_message_tier1 : settings.single_user_renewal_message_tier2;
    } else if (user.membership_type === CONSTANT.MEMBERSHIP_TYPE.shared) {
      message = isInTier1 ? settings.group_user_renewal_message_tier1 : settings.group_user_renewal_message_tier2;
    } else if (user.membership_type === CONSTANT.MEMBERSHIP_TYPE.mid_week) {
      message = isInTier1 ? settings.mid_week_user_renewal_message_tier1 : settings.mid_week_user_renewal_message_tier2;
    }

    return (
      <Row>
        <Col sm={6} smOffset={3}>
          <div className="renewal-message">
            <p>{message}</p>
          </div>
        </Col>
      </Row>
    );
  }
}
