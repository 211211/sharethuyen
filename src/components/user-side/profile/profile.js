import React from "react";
import reactCSS from "reactcss";
import { Link, withRouter } from "react-router";
import { inject, observer } from "mobx-react/index";

import {
  Row,
  Col,
  Grid,
  Panel,
  PanelBody,
  PanelContainer,
  PanelTabContainer,
  Button,
  Image,
  Nav,
  NavItem
} from "@sketchpixy/rubix";

import { URL_CONFIG, IMAGES } from "../../../common/config";
import UserSideHeader from "../_core/user-side-header";
import ProfileBilling from "./profile-billing";
import ProfileEndorsement from "./profile-endorsement";
import ProfileOverview from "./profile-overview";

@withRouter
@inject("store")
@observer
export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active_tab: props.location.query.active_tab || "overview",
      submitDisabled: false
    };
  }

  onClickSave() {
    this.childTab.onClickSave();
  }

  handleSelectTab(eventKey) {
    let newState = this.state;
    newState.active_tab = eventKey;
    this.setState(newState);
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  render() {
    const { settings } = this.props.store;
    const styles = reactCSS({
      default: {
        saveBtn: {
          marginRight: 50,
          marginTop: 120,
          position: "absolute",
          right: 0
        }
      }
    });

    let { active_tab } = this.state;
    let { submitDisabled } = this.state;

    return (
      <div className="user-side">
        <UserSideHeader />
        <PanelTabContainer id="pills" defaultActiveKey={active_tab} controls={false}>
          <Panel>
            <PanelBody style={{ padding: 20 }}>
              <Grid>
                <Row>
                  <Col xs={12} className="text-center">
                    <Image src={IMAGES.sailor} />
                    <h4 className="bshare-primary-color page-title">Manage Your Profile</h4>
                    <p>
                      Use the options below to edit your profile, update your password. You can also add payment
                      methods, select your membership type and pay for your membership and security deposit. The
                      endorsement tab will show you which boat class's you are eligible to book. If you have any issues
                      please don't hesitate to CONTACT {settings.site_name}.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <Nav bsStyle="pills" onSelect={::this.handleSelectTab} className="nav-light-blue nav-justified">
                      <NavItem eventKey="overview">Overview</NavItem>
                      <NavItem eventKey="billing">Billing & Membership Plan</NavItem>
                      <NavItem eventKey="endorsements">Endorsements</NavItem>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} style={{ marginTop: 20 }}>
                    {(() => {
                      switch (active_tab) {
                        case "overview":
                          return (
                            <ProfileOverview
                              ref={c => (this.childTab = c)}
                              router={this.props.router}
                              setSubmitDisable={::this.setSubmitDisable}
                            />
                          );
                          break;
                        case "billing":
                          return <ProfileBilling />;
                          break;
                        case "endorsements":
                          return <ProfileEndorsement />;
                          break;
                      }
                    })()}
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelTabContainer>
      </div>
    );
  }
}
