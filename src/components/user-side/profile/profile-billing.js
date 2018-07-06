import React from "react";
import { inject, observer } from "mobx-react";

import { Form } from "@sketchpixy/rubix";

import UserPaymentList from "../../_core/user-payment/user-payment-list";

@inject("store")
@observer
export default class ProfileBilling extends React.Component {
  constructor(props) {
    super(props);
  }

  loadUserDetail() {}

  render() {
    const user = this.props.store.user;

    return (
      <div>
        {(() => {
          if (user && user.id) {
            return (
              <Form horizontal>
                <UserPaymentList
                  user_side
                  user={user}
                  addresses={user.billing_addresses}
                  {...this.props}
                  loadUserDetail={::this.loadUserDetail}
                />
              </Form>
            );
          } else {
            return <span />;
          }
        })()}
      </div>
    );
  }
}
