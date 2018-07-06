import React from "react";
import Toggle from "react-toggle";
import { Row, Col, Button, Form, FormControl, FormGroup } from "@sketchpixy/rubix";
import Select from "react-select";
import CardReactFormContainer from "card-react";

import { CONSTANT, URL_CONFIG } from "../../../common/config";
import { inject, observer } from "mobx-react/index";
import { ControlLabel } from "@sketchpixy/rubix/lib/index";
import MembershipTypeUtil from "../../../common/membership-type-util";
import StripeLoader from "../stripe/stripe-loader";
import Util from "../../../common/util";
import client from "../../../common/http-client";
import { isNil } from "lodash/lang";

@inject("store")
@observer
export default class UserMembershipWaitlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      membershipType: "full",
      is_store_card: false,
      submitDisabled: false
    };

    this.handleChangeMembershipType = this.handleChangeMembershipType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }

  handleChangeMembershipType(type) {
    this.setState({
      membershipType: type.value
    });
  }

  render() {
    const user = this.props.store.user;
    const settings = this.props.store.settings;
    const { is_store_card, submitDisabled } = this.state;
    const { current_membership_waitlist } = user;
    const membershipWaitlistRequested =
      !isNil(current_membership_waitlist) &&
      current_membership_waitlist.status == CONSTANT.membershipWaitlistStatus.requested;
    let disabledUserTypes = settings.disabled_user_types || [];
    const { membership_waitlist_price } = settings;

    const MEMBERSHIP_TYPE = [
      CONSTANT.MEMBERSHIP_TYPE.full,
      CONSTANT.MEMBERSHIP_TYPE.mid_week,
      CONSTANT.MEMBERSHIP_TYPE.unlimited,
      CONSTANT.MEMBERSHIP_TYPE.shared,
      CONSTANT.MEMBERSHIP_TYPE.daily
    ];
    let availableMembershipType = MembershipTypeUtil.removeDisabledMembershipType(MEMBERSHIP_TYPE, disabledUserTypes);

    let options = availableMembershipType.map(type => {
      return { label: MembershipTypeUtil.membershipTypeToSharepassLabel(type), value: type };
    });

    return (
      <div>
        <h4 className="section-form-title">Waitlist</h4>
        {settings.membership_waitlist_message}
        {!membershipWaitlistRequested && (
          <div>
            <FormGroup>
              <Col sm={3} componentClass={ControlLabel}>
                Membership Type
              </Col>
              <Col sm={4}>
                <Select
                  name="membership-type"
                  value={this.state.membershipType}
                  labelKey="label"
                  valueKey="value"
                  options={options}
                  onChange={this.handleChangeMembershipType}
                />
              </Col>
            </FormGroup>
            <div id="card-wrapper" />
            <CardReactFormContainer container="card-wrapper" formatting={true}>
              <Form horizontal onSubmit={this.onSubmit} className={submitDisabled ? "is-loading" : ""}>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    Card Number
                  </Col>
                  <Col sm={4}>
                    <FormControl type="text" name="number" autoFocus placeholder="Card Number" data-stripe="number" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    Name on Card
                  </Col>
                  <Col sm={4}>
                    <FormControl type="text" name="name" placeholder="Cardholder name" data-stripe="name" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    Expiration Date
                  </Col>
                  <Col sm={4}>
                    <FormControl type="text" name="expiry" placeholder="MM/YYYY" data-stripe="exp" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    CVC
                  </Col>
                  <Col sm={4}>
                    <FormControl type="number" placeholder="CVC" name="cvc" data-stripe="cvc" />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    Membership Waitlist Price
                  </Col>
                  <Col sm={4}>
                    <FormControl.Static>
                      {Util.currencyFormatter().format(membership_waitlist_price)}
                    </FormControl.Static>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} componentClass={ControlLabel}>
                    Store This Card
                  </Col>
                  <Col sm={4}>
                    <label>
                      <Toggle name="is_store_card" checked={is_store_card} onChange={this.handleChangeInput} />
                    </label>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col sm={3} />
                  <Col sm={4}>
                    <Button outlined bsStyle="primary" disabled={submitDisabled} type="submit">
                      Pay
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardReactFormContainer>
          </div>
        )}
        {membershipWaitlistRequested && (
          <div className="alert alert-warning" style={{ textAlign: "center", marginTop: 10 }}>
            {`You've been added to Waitlist with ${MembershipTypeUtil.membershipTypeToSharepassLabel(
              current_membership_waitlist.membership_type
            )}. Amount paid: ${Util.currencyFormatter().format(
              current_membership_waitlist.paid_amount
            )}. Please wait for approval from Admin.`}
          </div>
        )}
        <StripeLoader />
      </div>
    );
  }

  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    if (!Stripe) {
      Util.growlError("Stripe is not ready at this moment!");
      return;
    }
    this.setState({ submitDisabled: true });
    const { is_store_card, membershipType } = this.state;
    Stripe.createToken(event.target, (status, response) => {
      if (response.error) {
        Util.growlError(response.error.message);
        this.setState({
          submitDisabled: false
        });
      } else {
        client
          .post(URL_CONFIG.profiles_pay_to_wait_list_path, {
            membership_type: membershipType,
            stripe_token: response.id,
            is_store_card
          })
          .then(
            res => {
              Util.growl("pay_to_waiting_list_success");
              if (res.membership_waitlist) {
                this.props.store.updateMembershipWaitlist(res.membership_waitlist);
              }
              if (!isNil(res.sources) && res.sources.length > 0) {
                this.props.store.updatePaymentSources(res.sources);
              }
            },
            res => {
              this.setState({
                submitDisabled: false
              });
            }
          );
      }
    });
  }
}
