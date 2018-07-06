import React from "react";
import reactCSS from "reactcss";
import { Link } from "react-router";

import { Col, Icon } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config.js";

export default class BoatShareUserRedFlag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      red_flag: {}
    };
  }

  componentDidMount() {
    if (this.props.red_flags) {
      this.buildRedFlag(this.props.red_flags);
    }

    if (this.props.fetch_data) {
      this.requestRedFlagData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fetch_data) {
      this.requestRedFlagData(nextProps);
    } else {
      // The data pass through props
      if (nextProps.red_flags !== this.props.red_flags) {
        this.buildRedFlag(nextProps.red_flags);
      }
    }
  }

  buildRedFlag(redFlags) {
    let red_flag = {};
    redFlags.filter(redFlag => {
      red_flag[redFlag] = true;
    });
    this.setState({ red_flag });
  }

  requestRedFlagData(props) {
    let { id } = props.user;
    if (id) {
      let url = props.user_side
        ? `${URL_CONFIG.profile_user_path}/red_flag`
        : `${URL_CONFIG.users_path}/${id}/red_flag`;
      $.get(url).then(res => {
        if (res) {
          let newState = this.state;
          newState.red_flag = res;
          this.setState(newState);
        }
      });
    }
  }

  hasRedFlag(isAdminOverride) {
    const { red_flag } = this.state;
    if (isAdminOverride) return false;
    return Object.keys(red_flag).length > 0;
  }

  render() {
    const styles = reactCSS({
      default: {
        cardButtonWrapper: {
          border: "1px solid #D71F4B",
          paddingTop: 12.25
        }
      }
    });

    let { red_flag } = this.state;

    if (Object.keys(red_flag).length > 0) {
      return (
        <Col sm={6} smOffset={3} style={styles.cardButtonWrapper}>
          {Object.keys(red_flag).map((red_flag_item, index) => {
            return (
              <RedFlagItem user_side={this.props.user_side} key={index} user={this.props.user} type={red_flag_item} />
            );
          })}
        </Col>
      );
    } else {
      return null;
    }
  }
}

class RedFlagItem extends React.Component {
  render() {
    let message, link;
    let { id } = this.props.user;
    switch (this.props.type) {
      case "need_security_deposit":
        message = "Need to pay security deposit";
        link = `${URL_CONFIG.users_path}/${id}/edit`;
        break;
      case "need_wa_state_marine_photo":
        message = "Need to add WA State Boaters card";
        link = `${URL_CONFIG.users_path}/${id}/endorsement`;
        break;
      case "need_driver_license_photo":
        message = "Need to add Driver License";
        link = `${URL_CONFIG.users_path}/${id}/endorsement`;
        break;
      case "need_field_required":
        message = "Need to finish all required fields in Endorsement list";
        link = `${URL_CONFIG.users_path}/${id}/endorsement`;
        break;
      default:
    }

    let is_admin = user_role == CONSTANT.MAIN_ROLE.admin;

    let messageTag = is_admin ? <Link to={link}>{message}</Link> : <span>{message}</span>;

    return (
      <p>
        <Icon glyph="icon-simple-line-icons-flag" className={"fg-deepred"} />
        {messageTag}
      </p>
    );
  }
}
