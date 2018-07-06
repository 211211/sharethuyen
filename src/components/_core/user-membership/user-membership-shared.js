import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";
import Loader from "react-loader";

import { Row, Col, FormControl, Icon, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import util from "../../../common/util";

export default class UserMembershipShared extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      members: [],
      invitations: [],
      loaded: false,
      pending_invitations: []
    };
    this.loadMembers();
  }

  initInvitations(users, pending_invitations) {
    let max_invitable_users = 4;
    let num_of_mem = users.length + pending_invitations.length;
    let invitations = [];
    for (let i = max_invitable_users - 1; i >= num_of_mem; i--) {
      invitations.push({
        email: "",
        isValid: true
      });
    }
    return invitations;
  }

  loadMembers() {
    if (this.state.loaded) {
      this.setState({ loaded: false });
    }
    client.get(URL_CONFIG.user_groups_path).then(res => {
      let members = res.users;
      let pending_invitations = res.pending_invitations ? res.pending_invitations.split(";") : [];
      let invitations = this.initInvitations(members, pending_invitations);
      this.setState({
        name: res.name,
        members: members,
        invitations: invitations,
        pending_invitations: pending_invitations,
        loaded: true
      });
    });
  }

  sendInvitation() {
    let { invitations } = this.state;
    let isValid = true;
    let invitations_filtered = invitations.filter(invitation => {
      let { email } = invitation;
      invitation.isValid = true;
      if (email.length > 0) {
        if (!util.isValidEmail(email)) {
          isValid = false;
          invitation.isValid = false;
        } else {
          return email;
        }
      }
    });
    if (isValid) {
      this.setState({ loaded: false });
      client
        .post(URL_CONFIG.user_groups_send_invitations_path, {
          emails: invitations_filtered.map(invitation => {
            return invitation.email;
          })
        })
        .then(
          res => {
            res.map(invitation => {
              if (invitation.result == "fail") {
                util.growlError(invitation.message);
              } else {
                util.growl(invitation.message);
              }
            });
            this.loadMembers();
          },
          () => {
            this.setState({ loaded: true });
          }
        );
    } else {
      this.setState({});
    }
  }

  reSendInvitation(email) {
    this.setState({ loaded: false });
    client
      .post(URL_CONFIG.user_groups_send_invitations_path, {
        emails: [email]
      })
      .then(
        res => {
          res.map(invitation => {
            if (invitation.result == "fail") {
              util.growlError(invitation.message);
            } else {
              util.growl(invitation.message);
            }
          });
          this.loadMembers();
        },
        () => {
          this.setState({ loaded: true });
        }
      );
  }

  handleChangeEmail(invitation, e) {
    let value = e.target.value;
    invitation.email = value;
    this.setState({});
  }

  handleRemoveInvitation(email) {
    let { members } = this.state;
    this.setState({ loaded: false });
    client
      .post(URL_CONFIG.user_groups_remove_invitation_path, {
        email: email
      })
      .then(
        res => {
          this.loadMembers();
        },
        res => {
          this.setState({ loaded: true });
        }
      );
  }

  render() {
    let { user } = this.props;
    let { members } = this.state;
    let { name } = this.state;
    let { pending_invitations } = this.state;

    let { invitations } = this.state;
    let { loaded } = this.state;

    return (
      <Row className={loaded ? "" : "is-loading"}>
        <Col xs={12} style={{ minHeight: 100 }}>
          <Loader loaded={loaded} />
          {(() => {
            if (name) {
              return (
                <Col smOffset={3} xs={9} style={{ marginTop: 10 }}>
                  <label>Group Name: {name}</label>
                </Col>
              );
            }
          })()}
          {(() => {
            if (members.length > 0) {
              return (
                <Col md={8} mdOffset={2} smOffset={1} sm={10} lg={6} lgOffset={3} xs={12}>
                  <label>Member(s)</label>
                  {members.map((member, index) => {
                    let currentUser = this.props.user;
                    let email = member.email != currentUser.email ? member.email : `${member.email} (yourself)`;
                    return (
                      <div className="share-member-item" key={index}>
                        <div className="member-email">{email}</div>
                        <div className="member-status">
                          {(() => {
                            if (member.membership_status === CONSTANT.MEMBERSHIP_STATUS.PAID) {
                              return (
                                <Icon
                                  className="fg-green"
                                  style={{ fontSize: 20 }}
                                  title="Membership charge paid"
                                  glyph="icon-fontello-ok"
                                />
                              );
                            } else {
                              return <span>NOT ACTIVE</span>;
                            }
                          })()}
                        </div>
                        <br />
                      </div>
                    );
                  })}
                </Col>
              );
            }
          })()}
          <br />
          {(() => {
            if (pending_invitations.length > 0) {
              return (
                <Col md={8} mdOffset={2} smOffset={1} sm={10} lg={6} lgOffset={3} xs={12} style={{ marginTop: 10 }}>
                  <label>Pending Invitation(s)</label>
                  {pending_invitations.map((invitation, index) => {
                    return (
                      <div className="share-member-item" key={index}>
                        <div className="member-email">{invitation}</div>
                        <div className="member-status">
                          <Icon
                            className="fg-green"
                            style={{ fontSize: 20 }}
                            title="Email sent"
                            glyph="icon-fontello-ok"
                          />
                        </div>
                        <div className="member-buttons">
                          <Button
                            bsStyle="red"
                            onClick={() => {
                              ::this.handleRemoveInvitation(invitation);
                            }}
                          >
                            Remove
                          </Button>{" "}
                          <Button
                            bsStyle="default"
                            onClick={() => {
                              ::this.reSendInvitation(invitation);
                            }}
                          >
                            Resend
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </Col>
              );
            }
          })()}
          <br />
          {(() => {
            if (invitations.length > 0) {
              return (
                <Col md={8} mdOffset={2} smOffset={1} sm={10} lg={6} lgOffset={3} xs={12} style={{ marginTop: 10 }}>
                  <label>Invitation(s)</label>
                  {invitations.map((invitation, index) => {
                    return (
                      <FormControl
                        style={{ marginTop: 10 }}
                        className={!invitation.isValid ? "error" : ""}
                        key={index}
                        type="text"
                        placeholder="Email"
                        value={invitation.email}
                        onChange={e => {
                          this.handleChangeEmail(invitation, e);
                        }}
                      />
                    );
                  })}
                  <Button outlined bsStyle="info" style={{ marginTop: 10 }} onClick={::this.sendInvitation}>
                    Send Invitation
                  </Button>
                </Col>
              );
            }
          })()}
        </Col>
      </Row>
    );
  }
}
