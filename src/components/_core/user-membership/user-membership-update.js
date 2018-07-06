import React from "react";
import { inject, observer } from "mobx-react/index";
import { Row, Col, Button } from "@sketchpixy/rubix";

import { CONSTANT } from "../../../common/config";
import MembershipTypeUtil from "../../../common/membership-type-util";
import UserMembershipChangeModal from "./user-membership-change-modal";
import UserMembershipShared from "./user-membership-shared";

@inject("store")
@observer
export default class UserMembershipUpdate extends React.Component {
  render() {
    let { user } = this.props;
    let { user_side } = this.props;
    let membership_type = MembershipTypeUtil.membershipTypeToSharepassLabel(user.membership_type);
    let can_change_membership = this.canChangeSharepassType();
    let shared_tpl = membership_type == "GROUP SHAREPASS" && user_side ? <UserMembershipShared user={user} /> : "";

    return (
      <div>
        <Row>
          <Col smOffset={3} sm={6}>
            <Row className="sharepass-type-box">
              <Col sm={6} className="text-center">
                <h5>{membership_type}</h5>
              </Col>
              {can_change_membership && (
                <Col sm={2} className="text-center">
                  <Button outlined bsStyle="info" style={{ marginTop: 5 }} onClick={::this.openChargeMembershipModal}>
                    Change
                  </Button>
                </Col>
              )}
            </Row>
          </Col>

          <UserMembershipChangeModal
            ref={c => (this.changeModal = c)}
            membership_type={membership_type}
            {...this.props}
          />
        </Row>
        {shared_tpl}
      </div>
    );
  }
  openChargeMembershipModal() {
    this.changeModal.wrappedInstance.open();
  }

  canUpdateCharge(charge) {
    return charge.status == CONSTANT.CHARGE_STATUS.created || charge.status == CONSTANT.CHARGE_STATUS.failed;
  }

  canChangeSharepassType() {
    const { user, user_side } = this.props;
    const { security_deposit_charge, current_membership_charge } = user;
    if (!user_side) return true;

    const { settings } = this.props.store;
    const { membership_waitlist_enabled, membership_waitlist_expired_enabled } = settings;

    const waitListEnabledForNewUser =
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.UNPAID && membership_waitlist_enabled;

    const waitListEnabledForExpiredUser =
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.EXPIRED && membership_waitlist_expired_enabled;

    if (waitListEnabledForNewUser || waitListEnabledForExpiredUser) {
      return false;
    }

    return this.canUpdateCharge(current_membership_charge) && this.canUpdateCharge(security_deposit_charge);
  }
}
