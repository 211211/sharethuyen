import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";

import { Col, Row } from "@sketchpixy/rubix";

import BookingLineItem from "./booking-line-item";

export default class BookingLineItems extends React.Component {
  onChangeLineItemValue(e) {
    let newState = this.state;
    newState.line_item.value = e.target.value;
    this.props.handleChangeLineItemField(this.props.line_item, "value", e.target.value);
    this.setState(newState);
  }

  render() {
    let { line_items } = this.props;

    return (
      <Row>
        {line_items.map(line_item => {
          return (
            <Col xs={12} key={line_item.id}>
              <BookingLineItem {...this.props} line_item={line_item} />
            </Col>
          );
        })}
      </Row>
    );
  }
}
