import React from "react";

import { Row } from "@sketchpixy/rubix";

import BookingChecklist from "./booking-checklist";

export default class BookingChecklists extends React.Component {
  render() {
    let { checklists } = this.props;

    return (
      <Row className="booking-checklists">
        {checklists.map(checklist => {
          return <BookingChecklist {...this.props} key={checklist.id} checklist={checklist} />;
        })}
      </Row>
    );
  }
}
