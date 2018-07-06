import React from "react";
import ReactDOM from "react-dom";

export default class PaymentCardDetail extends React.Component {
  render() {
    let { card } = this.props;
    return (
      <span>
        ···· {card.last4}
        <span className="label label-success" style={{ marginLeft: 15 }}>
          {card.brand} {card.funding} {card.object}
        </span>
      </span>
    );
  }
}
