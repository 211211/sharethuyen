import React from "react";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import reactCSS from "reactcss";
import { Link } from "react-router";

import { Col, Icon, Row } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, MESSAGES } from "../../../common/config.js";
import client from "../../../common/http-client";
import util from "../../../common/util";
import Loader from "react-loader";

@inject("store", "newBookingStore")
@observer
export default class RedFlagMembership extends React.Component {
  constructor() {
    super();
    this.state = {
      emailSent: false,
      emailSending: false
    };
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  @computed
  get payment() {
    return this.props.store.payment;
  }

  render() {
    const styles = reactCSS({
      default: {
        cardButtonWrapper: {
          border: "1px solid #D71F4B",
          paddingTop: 12.25,
          paddingLeft: 10,
          paddingRight: 10
        }
      }
    });
    const { booking, props, state, payment } = this;
    const { emailSent, emailSending } = state;
    const { current_user, user_side } = props;

    // On admin, user is confirmed as default
    let userConfirmed = true;
    let userCardNeedAdded = false;
    if (user_side) {
      userConfirmed = current_user.confirmed;
    }
    if (user_side && payment.sources.length == 0) {
      userCardNeedAdded = true;
    }
    let { user } = booking;
    let user_loaded = typeof user.id !== "undefined";
    let paid_membership = this.isPaidMembership(user);
    const { membership_status, shared_membership_status } = user;
    let isMidWeekUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.mid_week;
    let isDailyUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;

    if (user_loaded && ((!paid_membership && !isDailyUser) || isMidWeekUser || !userConfirmed || userCardNeedAdded)) {
      return (
        <Row style={{ marginBottom: 10 }}>
          <Col md={8} mdPush={2}>
            <Col style={styles.cardButtonWrapper}>
              {membership_status !== CONSTANT.MEMBERSHIP_STATUS.PAID &&
                !isDailyUser && (
                  <RedFlagItem message={MESSAGES.booking_membership_need_paid} user={user} user_side={user_side} />
                )}
              {shared_membership_status &&
                shared_membership_status !== CONSTANT.MEMBERSHIP_STATUS.PAID && (
                  <RedFlagItem
                    message={MESSAGES.booking_membership_shared_group_need_paid}
                    user={user}
                    user_side={user_side}
                  />
                )}
              {isMidWeekUser && <RedFlagItem message={MESSAGES.booking_mid_week} user={user} user_side={user_side} />}
              {!userConfirmed && (
                <p>
                  <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
                  {MESSAGES.email_not_verified_before_booking}.
                  {!emailSent && (
                    <a onClick={this.sendConfirmEmail.bind(this)} href="javascript:void(0)">
                      {" "}
                      Send confirmation email!
                    </a>
                  )}
                  {emailSending && <span> Sending...</span>}
                </p>
              )}
              {userCardNeedAdded && (
                <RedFlagItem message={MESSAGES.card_need_added} user={user} user_side={user_side} activeTab="billing" />
              )}
            </Col>
          </Col>
        </Row>
      );
    } else return null;
  }

  sendConfirmEmail() {
    this.setState({
      emailSent: true,
      emailSending: true
    });
    client.post(URL_CONFIG.profile_user_send_confirmation_email_path).then(
      () => {
        // Message come from server
        this.setState({
          emailSending: false
        });
      },
      () => {
        util.growlError(MESSAGES.cannot_send_confirmation_mail);
        this.setState({
          emailSent: false,
          emailSending: false
        });
      }
    );
  }

  isPaidMembership(user) {
    return (
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID &&
      (user.shared_membership_status === null || user.shared_membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID)
    );
  }
}

class RedFlagItem extends React.Component {
  render() {
    let { id } = this.props.user;
    let { user_side, message } = this.props;
    let activeTab = this.props.activeTab || "overview";
    let link = `${URL_CONFIG.users_path}/${id}/edit`;
    if (user_side) {
      link = `${URL_CONFIG.profile_user_path}?active_tab=${activeTab}`;
    }

    return (
      <p>
        <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
        <Link to={link}>{message}</Link>
      </p>
    );
  }
}
