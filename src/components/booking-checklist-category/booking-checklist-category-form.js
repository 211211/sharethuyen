import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";
import { CirclePicker } from "react-color";

import { Col, Form, FormGroup, FormControl, ControlLabel } from "@sketchpixy/rubix";

import BookingChecklistItems from "./booking-checklist-items";

export default class BookingChecklistCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.bookingChecklistCategory;
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState = nextProps.bookingChecklistCategory;
    this.setState(newState);
  }

  handleChangeName(e) {
    this.props.parent.handleFieldChange("name", e.target.value);
  }

  handleChangeLineItemName(key, value) {
    this.props.parent.handleChangeLineItemName(key, value);
  }

  handleRemoveLineItem(line_item) {
    this.props.parent.handleRemoveLineItem(line_item);
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Category Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              placeholder="Category Name"
              autoFocus
              value={this.state.name}
              onChange={::this.handleChangeName}
            />
          </Col>
        </FormGroup>

        <BookingChecklistItems
          parent={this}
          addNewLineItem={this.props.addNewLineItem}
          line_items={this.props.bookingChecklistCategory.line_items}
        />
      </Form>
    );
  }
}
