import React from "react";

export default class BoatShareAddress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { address } = this.props;
    return (
      <div>
        <p style={{ marginBottom: 3 }}>{address.line1}</p>
        <p style={{ marginBottom: 3 }}>{address.line2}</p>
        <p style={{ marginBottom: 3 }}>
          {address.city}, {address.state} {address.zip}, {address.country}
        </p>
      </div>
    );
  }
}
