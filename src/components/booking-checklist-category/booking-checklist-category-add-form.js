import React from "react";
import ReactDOM from "react-dom";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

import BoatShareForm from "../_core/boat-share-form";
import BookingChecklistCategoryForm from "./booking-checklist-category-form";
import BookingChecklistUtil from "./booking-checklist-util";
import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";

export default class BookingChecklistCategoryAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      booking_checklist_category: {
        name: "",
        line_items: []
      }
    };
  }

  onSubmitFn() {
    this.boatShareForm.setSubmitDisable(true);
    this.setState({
      errors: {}
    });
    let checklist = this.state.booking_checklist_category;

    client
      .postFormData(
        `${URL_CONFIG.booking_checklist_categories_path}`,
        BookingChecklistUtil.buildSubmitChecklist(checklist)
      )
      .then(
        response => {
          this.boatShareForm.setSubmitDisable(false);
          this.props.router.push(URL_CONFIG.booking_checklist_categories_path);
        },
        response => {
          this.boatShareForm.setSubmitDisable(false);
          if (response.status == 400) {
            var resObj = response.responseJSON;
            this.setState({ errors: resObj.errors });
          }
        }
      );
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.booking_checklist_categories_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.booking_checklist_category[fieldId] = value;
    this.setState(newState);
  }

  handleChangeLineItemName(key, value) {
    var newState = this.state;
    let checklist = newState.booking_checklist_category;
    checklist.line_items[key].name = value;
    this.setState(newState);
  }

  handleRemoveLineItem(line_item) {
    let newState = this.state;
    line_item._destroy = true;
    this.setState(newState);
  }

  addNewLineItem() {
    let newState = this.state;
    let checklist = newState.booking_checklist_category;
    checklist.line_items.push({
      name: "",
      thumbnail_url: "/imgs/app/no-image-available.jpg"
    });
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add Booking Checklist"
        submitBtn="Create"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <BookingChecklistCategoryForm
          parent={this}
          addNewLineItem={::this.addNewLineItem}
          bookingChecklistCategory={this.state.booking_checklist_category}
        />
      </BoatShareForm>
    );
  }
}
