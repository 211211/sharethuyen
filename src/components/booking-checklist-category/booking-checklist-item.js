import React from "react";

import { Col, Table, Icon, FormControl, Button } from "@sketchpixy/rubix";

import BoatShareForm from "../_core/boat-share-form";
import BookingChecklistCategoryForm from "./booking-checklist-category-form";
import { URL_CONFIG } from "../../common/config.js";
import client from "../../common/http-client";

export default class BookingChecklistItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line_item: props.line_item
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.line_item = nextProps.line_item;
    this.setState(newState);
  }

  handleChangeName(e) {
    this.props.parent.handleChangeName(this.props.index, e.target.value);
  }

  handleRemoveLineItem() {
    this.props.parent.handleRemoveLineItem(this.props.line_item);
  }

  render() {
    let { line_item } = this.state;
    return (
      <tr>
        <td>
          <FormControl
            type="text"
            placeholder="Line Item Name"
            value={line_item.name}
            onChange={::this.handleChangeName}
          />
        </td>
        <td>
          <div className="text-center">
            <Button outlined bsStyle="danger" className="fav-btn" onClick={::this.handleRemoveLineItem}>
              <Icon glyph="icon-simple-line-icons-close" />
            </Button>
          </div>
        </td>
      </tr>
    );
  }
}
