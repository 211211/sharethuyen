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
import BoatClassForm from "./boat-class-form";
import BoatClassUtil from "./boat-class-util";
import { URL_CONFIG } from "../../common/config.js";

export default class BoatClassAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      boatClass: BoatClassUtil.mapBoatClass({})
    };
  }

  onSubmitFn() {
    this.boatShareForm.setSubmitDisable(true);
    let boatClass = this.state.boatClass;

    $.post(URL_CONFIG.boat_classes_path_json, {
      boat_class: boatClass
    }).then(
      response => {
        this.boatShareForm.setSubmitDisable(false);
        this.props.router.push(URL_CONFIG.boat_classes_path);
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
    this.props.router.push(URL_CONFIG.boat_classes_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.boatClass[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add Boat Class"
        submitBtn="Create"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <BoatClassForm parent={this} boatClass={this.state.boatClass} />
      </BoatShareForm>
    );
  }
}
