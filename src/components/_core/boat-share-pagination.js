import React from "react";

import { Pagination } from "@sketchpixy/rubix";

export default class BoatSharePagination extends React.Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    return (
      <Pagination
        bsSize="large"
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        items={this.props.items}
        maxButtons={3}
        activePage={this.props.activePage}
        onSelect={::this.props.onSelect}
      />
    );
  }
}
