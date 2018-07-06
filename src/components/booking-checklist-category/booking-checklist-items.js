import React from "react";

import { Col, Table, Icon, Button } from "@sketchpixy/rubix";

import BoatShareForm from "../_core/boat-share-form";
import BookingChecklistCategoryForm from "./booking-checklist-category-form";
import { URL_CONFIG } from "../../common/config.js";
import client from "../../common/http-client";
import BookingChecklistItem from "./booking-checklist-item";

export default class BookingChecklistItems extends React.Component {
  constructor(props) {
    super(props);
  }

  onCancelFn() {
    this.props.router.push(`${URL_CONFIG.booking_checklist_categories_path}`);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.booking_checklist_category[fieldId] = value;
    this.setState(newState);
  }

  handleChangeName(key, name) {
    this.props.parent.handleChangeLineItemName(key, name);
  }

  handleRemoveLineItem(line_item) {
    this.props.parent.handleRemoveLineItem(line_item);
  }

  render() {
    return (
      <Col md={12}>
        <h4 className="section-form-title">Line items</h4>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.line_items.map((line_item, index) => {
              if (!line_item._destroy === true) {
                return <BookingChecklistItem key={index} index={index} line_item={line_item} parent={this} />;
              }
            })}
          </tbody>
        </Table>
        <Button outlined bsStyle="info" onClick={this.props.addNewLineItem}>
          Add Line Item
        </Button>
      </Col>
    );
  }
}
