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
import BoatAmenityForm from "./boat-amenity-form";
import { URL_CONFIG } from "../../common/config";

export default class BoatAmenityAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      boat_amenity: {
        name: "",
        icon: ""
      }
    };
  }

  onSubmitFn() {
    let boat_amenity = this.state.boat_amenity;

    var formData = new FormData();
    formData.append("boat_amenity[name]", boat_amenity.name.trim());
    formData.append("boat_amenity[icon]", boat_amenity.icon);
    $.ajax({
      url: URL_CONFIG.boat_amenities_path,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "POST"
    }).then(
      response => {
        this.props.router.push(URL_CONFIG.boat_amenities_path);
      },
      response => {
        if (response.status == 400) {
          var resObj = response.responseJSON;
          this.setState({ errors: resObj.errors });
        }
      }
    );
  }

  onCancelFn() {
    this.props.router.push(URL_CONFIG.boat_amenities_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.boat_amenity[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add Boat Amenity"
        submitBtn="Create"
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <BoatAmenityForm parent={this} boat_amenity={this.state.boat_amenity} />
      </BoatShareForm>
    );
  }
}
