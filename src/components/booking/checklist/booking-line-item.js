import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";

import { Row, Col, Radio } from "@sketchpixy/rubix";

import BookingLineItemUpload from "./booking-line-item-upload";

export default class BookingLineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line_item: props.line_item
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.state;
    newState.line_item = nextProps.line_item;
    this.setState(newState);
  }

  onChangeLineItemValue(e) {
    let newState = this.state;
    newState.line_item.value = e.target.value;
    this.props.handleChangeLineItemField(this.props.line_item, "value", e.target.value);
    this.setState(newState);
  }

  render() {
    let { line_item } = this.state;
    let { booking_line_items } = this.props;

    let foundLineItem = booking_line_items.find(booking_line_item => {
      return line_item.id == booking_line_item.line_item_id;
    });

    if (foundLineItem) {
      line_item.value = foundLineItem.value;
    }
    const styles = reactCSS({
      default: {
        optionGroup: {
          width: "180px",
          display: "inline-block"
        }
      }
    });

    return (
      <div className="booking-checklist-item">
        <Row>
          <Col xs={6} sm={8}>
            {line_item.name} <span className="req-field">*</span>
          </Col>
          <Col xs={3} sm={2}>
            <div style={styles.optionGroup}>
              <Radio
                defaultValue="yes"
                inline
                onChange={::this.onChangeLineItemValue}
                checked={line_item.value == "yes"}
                readOnly={this.props.readonly}
                disabled={this.props.readonly}
                name={"line-item-options" + line_item.id}
              >
                Yes
              </Radio>
              <Radio
                defaultValue="no"
                inline
                onChange={::this.onChangeLineItemValue}
                checked={line_item.value == "no"}
                readOnly={this.props.readonly}
                disabled={this.props.readonly}
                name={"line-item-options" + line_item.id}
              >
                No
              </Radio>
            </div>
          </Col>
          <Col xs={3} sm={2}>
            <BookingLineItemUpload booking_line_item={foundLineItem} {...this.props} />
          </Col>
        </Row>
      </div>
    );
  }
}
