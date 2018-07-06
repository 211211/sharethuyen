import React from "react";
import { inject, observer } from "mobx-react/index";
import UserMembershipUpdate from "./user-membership-update";
import UserMembershipWaitlist from "./user-membership-waitlist";
import { CONSTANT } from "../../../common/config";
import UserCharge from "../user-payment/user-charge";
import { isNil } from "lodash/lang";
import Sharepass from "./sharepass";

@inject("store")
@observer
export default class UserMembership extends React.Component {
  render() {
    const isWaitListShown = this.isWaitListShown();
    if (isWaitListShown) {
      return <UserMembershipWaitlist />;
    } else {
      return <Sharepass {...this.props} />;
    }
  }

  isWaitListShown() {
    const { user_side } = this.props;

    // WaitList if for user side only
    if (!user_side) return false;

    const { settings, user } = this.props.store;
    const { current_membership_waitlist } = user;
    const { membership_waitlist_enabled, membership_waitlist_expired_enabled } = settings;

    const membershipWaitlistIsApproved =
      !isNil(current_membership_waitlist) &&
      !isNil(current_membership_waitlist.status) &&
      current_membership_waitlist.status == CONSTANT.membershipWaitlistStatus.approved;

    // Membership waitlist is approved, let user make payment for membership
    if (membershipWaitlistIsApproved) return false;

    const waitListEnabledForNewUser =
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.UNPAID && membership_waitlist_enabled;

    const waitListEnabledForExpiredUser =
      user.membership_status === CONSTANT.MEMBERSHIP_STATUS.EXPIRED && membership_waitlist_expired_enabled;
    return waitListEnabledForNewUser || waitListEnabledForExpiredUser;
  }
}
