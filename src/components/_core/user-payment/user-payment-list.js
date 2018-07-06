import React from "react";
import { inject, observer } from "mobx-react/index";
import { Col, FormGroup, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import BoatShareAddCardModal from "../boat-share-add-card-modal";
import UserPaymentChangeDefaultCardModal from "./user-payment-change-default-card-modal";
import UserPaymentSource from "./user-payment-source";
import UserCharge from "./user-charge";
import UserMembership from "../user-membership/user-membership";
import UserMembershipWaitlist from "../user-membership/user-membership-waitlist";
import ProfileRequestDepositReturn from "../../user-side/profile/profile-request-deposit-return";
import UserRequestDepositReturn from "./user-request-deposit-return";

@inject("store")
@observer
export default class UserPaymentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddCardModal: false,
      showAddBankAccountModal: false,
      showUserPaymentChangeDefaultCardModal: false
    };
  }

  openAddCardModal() {
    this.setState({
      showAddCardModal: true
    });
  }

  openAddBankAccountModal() {
    this.setState({
      showAddBankAccountModal: true
    });
  }

  openChangeDefaultCardModal() {
    this.changeDefaultCardModal.open();
  }

  close() {
    this.setState({
      showAddCardModal: false
    });
  }

  closeAddBankAccountModal() {
    this.setState({
      showAddBankAccountModal: false
    });
  }

  changeDefaultCardResolvedFn() {
    this.props.store.fetchPayment();
  }

  render() {
    const { payment, settings } = this.props.store;
    let { sources } = payment;
    let { user, user_side } = this.props;
    let default_source_id = payment.default_source;

    let active_membership_charge = user.current_membership_charge;
    let isDailyUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;
    let isUnlimited = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;
    const userPresent = typeof user.id !== "undefined";

    let default_source = sources.filter(source => {
      return source.id === default_source_id;
    })[0];

    let bank_account_sources = sources.filter(source => {
      return source.object === "bank_account" && source.id !== default_source_id;
    });

    let card_sources = sources.filter(source => {
      return source.object !== "bank_account" && source.id !== default_source_id;
    });

    let deposit_return = user_side ? (
      <ProfileRequestDepositReturn />
    ) : (
      <UserRequestDepositReturn
        depositCharge={user.security_deposit_charge}
        membershipStatus={user.membership_status}
      />
    );

    return (
      <div>
        {userPresent && <UserMembership {...this.props} user={user} />}
        {userPresent && (
          <div>
            <div className="section-form-title">
              <h4>Security Deposit</h4>
              <small>A security deposit must be paid before any member can take a boat out.</small>
            </div>
            <UserCharge
              user={user}
              charge={user.security_deposit_charge}
              ref={c => {
                this.security_charge = c;
              }}
              {...this.props}
            />
            {deposit_return}
          </div>
        )}
        <div className="user-billing-address-group">
          <div className="section-form-title">
            <h4>Payment Methods</h4>
            <small>
              You can add as many credit cards or bank accounts as you please. You may also select your default payment
              method. This will be used by {settings.site_name} for any extra charges such as fuel.{" "}
            </small>
            <p>
              <small>
                Please note if you are adding a bank account you will need to verify it. You can do this by confirming
                the two small deposits we make into your account.
              </small>
            </p>
          </div>
          <FormGroup style={{ marginTop: 20 }}>
            <Col sm={3} />
            <Col sm={9} className="text-right">
              <Button outlined bsStyle="info" onClick={::this.openAddCardModal}>
                Add Card
              </Button>

              <Button outlined bsStyle="info" style={{ marginLeft: 10 }} onClick={::this.openAddBankAccountModal}>
                Add Bank Account
              </Button>

              <Button outlined bsStyle="info" style={{ marginLeft: 10 }} onClick={::this.openChangeDefaultCardModal}>
                Change Default
              </Button>
            </Col>
          </FormGroup>
        </div>

        {(() => {
          if (default_source && !default_source._destroy) {
            return (
              <div>
                <h4>Default Payment Method</h4>
                <UserPaymentSource
                  card={default_source}
                  addresses={this.props.addresses}
                  email={this.props.user.email}
                  {...this.props}
                />
              </div>
            );
          }
        })()}

        {(() => {
          if (bank_account_sources.length > 0) {
            return (
              <div>
                <h4>Bank Accounts</h4>
                {bank_account_sources.map((card, index) => {
                  if (!card._destroy) {
                    return (
                      <UserPaymentSource
                        key={index}
                        card={card}
                        addresses={this.props.addresses}
                        email={this.props.user.email}
                        {...this.props}
                      />
                    );
                  }
                })}
              </div>
            );
          }
        })()}

        {(() => {
          if (card_sources.length > 0) {
            return (
              <div>
                <h4>Cards</h4>
                {card_sources.map((card, index) => {
                  if (!card._destroy) {
                    return (
                      <UserPaymentSource
                        key={index}
                        card={card}
                        addresses={this.props.addresses}
                        email={this.props.user.email}
                        {...this.props}
                      />
                    );
                  }
                })}
              </div>
            );
          }
        })()}

        <BoatShareAddCardModal
          show={this.state.showAddCardModal}
          closeModal={::this.close}
          {...this.props}
          email={this.props.user.email}
        />

        <BoatShareAddCardModal
          show={this.state.showAddBankAccountModal}
          closeModal={::this.closeAddBankAccountModal}
          isBankAccount={true}
          email={this.props.user.email}
        />

        <UserPaymentChangeDefaultCardModal
          ref={c => (this.changeDefaultCardModal = c)}
          sources={sources}
          email={this.props.user.email}
          default_source={default_source_id}
          resolvedFn={::this.changeDefaultCardResolvedFn}
        />
      </div>
    );
  }
}
