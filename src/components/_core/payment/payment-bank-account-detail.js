import React from "react";
import ReactDOM from "react-dom";

export default class PaymentBankAccountDetail extends React.Component {
  render() {
    let { card } = this.props;
    return (
      <span>
        ···· {card.last4}
        <span className="label label-success" style={{ marginLeft: 15 }}>
          Bank Account
        </span>
      </span>
    );
  }
}
