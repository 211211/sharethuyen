import React from "react";
import { inject, observer } from "mobx-react/index";
import UserMembershipUpdate from "./user-membership-update";
import UserMembershipWaitlist from "./user-membership-waitlist";
import { CONSTANT } from "../../../common/config";
import UserCharge from "../user-payment/user-charge";

@inject("store")
@observer
export default class Sharepass extends React.Component {
  render() {
    const { settings } = this.props.store;
    const { user } = this.props;
    const isDailyUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.daily;
    const isUnlimited = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.unlimited;
    const active_membership_charge = user.current_membership_charge;
    let expire =
      user.membership_valid_until && !isDailyUser && !isUnlimited ? (
        <div className="text-center">
          <strong>EXPIRE ON: {user.membership_valid_until}</strong>
        </div>
      ) : null;

    if (user.membership_status === CONSTANT.MEMBERSHIP_STATUS.EXPIRED) {
      expire = (
        <div className="text-center">
          <strong style={{ color: "red" }}>EXPIRED</strong>
        </div>
      );
    }
    return (
      <div>
        <div className="section-form-title">
          <h4>Sharepass Type</h4>
          <small>
            Please select your desired sharepass membership. If you select group you can invite other group members
            here. Please note, no one from the group will be able to make a booking until at least 2 group members have
            paid their membership charge.
          </small>
          <p>
            <small>
              For the unlimited membership, there is a monthly fee that will be required to keep your membership
              current. The fee depends on which plan you choose, which will be arranged after payment by
              {settings.site_name} to get you set up to go boating. As long as the membership is current, this one-time
              initiation fee of $2995 will never be charged again. For more details, visit our unlimited membership
              page.
            </small>
          </p>
        </div>
        <UserMembershipUpdate {...this.props} user={user} />
        <div>
          {!isDailyUser && (
            <div>
              <div className="section-form-title">
                <h4>Sharepass Charges</h4>
                <small>
                  Please select your payment method and click pay now to confirm your membership and start booking
                  boats. Once paid you will need to contact {settings.site_name} to determine what class boats you can
                  book.
                </small>
                <p>
                  <small>
                    Please note once you have paid your membership charge, your membership type is confirmed for the
                    season. If you would like to upgrade from a group or weekday sharepass membership to a full
                    sharepass membership, you will need to contact {settings.site_name}.
                  </small>
                </p>
              </div>
              <UserCharge user={user} charge={active_membership_charge} {...this.props} />
              {expire}
            </div>
          )}
        </div>
      </div>
    );
  }
}
