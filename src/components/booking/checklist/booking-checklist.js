import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";

import { Col } from "@sketchpixy/rubix";

import BookingLineItems from "./booking-line-items";

export default class BookingChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checklist: props.checklist
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.state;
    newState.checklist = nextProps.checklist;
    this.setState(newState);
  }

  render() {
    let { checklist } = this.props;

    return (
      <Col md={12} style={{ marginTop: 10 }} className="checklist-category">
        <center className="checklist-category-name">{checklist.name}</center>
        <BookingLineItems {...this.props} line_items={checklist.line_items} />
      </Col>
    );
  }
}
