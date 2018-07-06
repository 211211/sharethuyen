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

import BoatShareForm from "./../_core/boat-share-form";
import BoatForm from "./boat-form";
import { URL_CONFIG } from "../../common/config";
import BoatUtil from "./boat-util";
import client from "../../common/http-client";
import Util from "../../common/util";

export default class BoatAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      boat: BoatUtil.mapBoat({}),

      //To be upload images
      boat_images: []
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.boats_path}/statuses`).then(res => {
      var newState = this.state;
      newState.boat.statuses = res;
      this.setState(newState);
    });
  }

  onSubmitFn() {
    const { fuel_rate_of_burn, fuel_meter_enabled } = this.state.boat;
    if (!fuel_meter_enabled && fuel_rate_of_burn <= 0) {
      Util.growlError("Rate of burn must be > 0");
      return;
    }
    this.boatShareForm.setSubmitDisable(true);
    let { boat } = this.state;
    let boatFormData = BoatUtil.buildSubmitBoat(boat, this.state.boat_images);

    client.postFormData(URL_CONFIG.boats_path_json, boatFormData).then(
      response => {
        this.props.router.push(URL_CONFIG.boats_path);
      },
      response => {
        this.boatShareForm.setSubmitDisable(false);
        if (response.status == 400) {
          if (response.responseJSON.hasOwnProperty("errors")) {
            this.setState({ errors: response.responseJSON.errors });
          }
        }
      }
    );
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.boats_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    if (fieldId == "image") {
      if (typeof newState.boat_images == "undefined") {
        newState.boat_images = [];
      }
      if (value && value.length > 0) {
        for (var i = 0; i < value.length; i++) {
          newState.boat_images.push({
            image_url: value[i],
            is_primary: false
          });
        }
      }
      newState.boat_images[0].is_primary = true;
    } else {
      newState.boat[fieldId] = value;
    }
    this.setState(newState);
  }

  handleRemoveFile(index) {
    var newState = this.state;
    newState.boat_images.splice(index, 1);
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add Boat"
        submitBtn="Create"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <BoatForm parent={this} toBeUploadImages={this.state.boat_images} boat={this.state.boat} />
      </BoatShareForm>
    );
  }
}
