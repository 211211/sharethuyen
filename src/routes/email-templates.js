import React from "react";
import Select from "react-select";
import Trumbowyg from "react-trumbowyg";

import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";
import { mapKeys } from "lodash/object";
import { includes } from "lodash/collection";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";

import { inject, observer } from "mobx-react";
import { computed, observable } from "mobx";

const EMAIL_TEMPLATES = [
  {
    name: "Booking Confirmation Notification",
    key: "email_booking_confirmation_notification",
    description: "Send to users once they placed a booking",
    vars: ["user_first_name", "booking_confirmation_details"]
  },
  {
    name: "Booking Reminder",
    key: "email_booking_reminder",
    description: "Send to users to remind them about the booking, 7 days and 48 hours before departure time",
    vars: ["user_first_name", "booking_details", "redflag"]
  },
  {
    name: "Booking Completed Notification",
    key: "email_booking_completed_notification",
    description: "Send to user once a booking is COMPLETED",
    vars: ["user_first_name", "booking_completed_details", "yelp_review_url"]
  },
  {
    name: "New Charge Notification",
    key: "email_new_charge_notification",
    description: "Send to users when they have a new charge",
    vars: ["user_first_name", "charge_details"]
  },
  {
    name: "Deposit Returned Notification",
    key: "email_deposit_returned_notification",
    description: "Send to users when admin returned Security Deposit",
    vars: ["user_first_name", "returned_amount", "returned_time", "returned_method"]
  },
  {
    name: "Group Invitation Notification",
    key: "email_group_invitation_notification",
    description: "Send to users when someone invite them to a group",
    vars: ["user_first_name", "sender_full_name", "join_group_url"]
  },
  {
    name: "User Welcome Email",
    key: "email_user_welcome_email",
    description: "Send to users when they signed up",
    vars: ["user_first_name"]
  },
  {
    name: "Membership Waitlist Approved Notification",
    key: "email_membership_waitlist_approved_notification",
    description: "Send to users when their membership waitlist has been approved",
    vars: ["user_first_name", "login_url"]
  },
  {
    name: "New Lesson Notification",
    key: "email_new_lesson_notification",
    description: "Send to users when they booked a lesson",
    vars: ["user_first_name", "user_full_name", "user_phone", "user_email", "lesson_name", "date"]
  },
  {
    name: "Boat Class Available for Waitlist Notification",
    key: "email_reserve_boat_class_for_waitlist",
    description: "Send to users when boat class they subscribed now available due to booking cancellation",
    vars: ["user_first_name", "boat_class_name", "date"]
  }
];

@inject("store")
@observer
export default class EmailTemplates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current_key: "email_booking_confirmation_notification",
      currentEmailContent: null
    };
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  transformSubmitData() {
    let settings = [];
    let subjectKey = `${this.state.current_key}_subject`;

    settings.push({
      key: subjectKey,
      value: this.settings[subjectKey]
    });

    if (this.state.currentEmailContent !== null) {
      settings.push({
        key: this.state.current_key,
        value: this.state.currentEmailContent
      });
    }

    return settings;
  }

  setSubmitDisable(val) {
    this.setState({
      submitDisabled: val
    });
  }

  onSubmitFn() {
    this.setSubmitDisable(true);
    let settings = this.transformSubmitData();
    client
      .put(URL_CONFIG.update_batch_settings_path, {
        settings: this.transformSubmitData()
      })
      .then(
        res => {
          util.growl(res.message);
          this.props.store.updateSettings(res.settings);
          this.setSubmitDisable(false);
        },
        response => {
          this.setSubmitDisable(false);
        }
      );
  }

  handleChangeSubject(event) {
    let currentKey = this.state.current_key;
    this.props.store.updateSettingAttribute(`${currentKey}_subject`, event.target.value);
  }

  handleChangeEmailContent(event) {
    this.setState({
      currentEmailContent: event.target.innerHTML
    });
  }

  emailTemplateSelectOption(option) {
    return <p className="boat-class-select-item">{option.name}</p>;
  }

  onChangeEmailTemplate(option) {
    let currentKey = option.key;

    this.setState({
      current_key: currentKey,
      currentEmailContent: this.settings[currentKey]
    });
  }

  render() {
    let currentKey = this.state.current_key;
    let template = EMAIL_TEMPLATES.find(template => template.key === currentKey);
    let description = template.description;
    let vars = template.vars.join("\n");
    let subjectKey = `${currentKey}_subject`;

    let currentSubject = this.settings[subjectKey];
    let currentEmailContent = this.settings[currentKey];

    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Form horizontal>
                  <Row className="page-header">
                    <Col md={12}>
                      <h3>Email Templates</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      Email Templates
                    </Col>
                    <Col sm={9}>
                      <Select
                        name="email_template"
                        value={this.state.current_key}
                        labelKey="name"
                        valueKey="key"
                        options={EMAIL_TEMPLATES}
                        optionRenderer={::this.emailTemplateSelectOption}
                        onChange={::this.onChangeEmailTemplate}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <h4 className="section-form-title" />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      Description
                    </Col>
                    <Col sm={9}>
                      <p>{description}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      Variables
                    </Col>
                    <Col sm={9}>
                      <pre>{vars}</pre>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <h4 className="section-form-title" />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      Email Subject
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        type="text"
                        name="email-subject"
                        value={currentSubject}
                        onChange={::this.handleChangeSubject}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} componentClass={ControlLabel}>
                      Email Content
                    </Col>
                    <Col sm={9}>
                      <Trumbowyg
                        id="react-trumbowyg"
                        data={currentEmailContent}
                        onChange={::this.handleChangeEmailContent}
                      />
                    </Col>
                  </Row>
                </Form>
              </Grid>
            </PanelBody>
            <PanelFooter className="text-right">
              <Grid>
                <Row>
                  <Col md={12} style={{ marginBottom: 10 }}>
                    <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={this.state.submitDisabled}>
                      Update
                    </Button>
                  </Col>
                </Row>
              </Grid>
            </PanelFooter>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
