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

import { URL_CONFIG } from "../../common/config";
import client from "../../common/http-client";
import BoatShareForm from "../_core/boat-share-form";
import BoatForm from "./boat-form";
import BoatUtil from "./boat-util";
import BoatFuel from "./fuel/boat-fuel";
import Util from "../../common/util";

export default class BoatEditForm extends React.Component {
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
    this.fetchBoat();
  }

  fetchBoat() {
    let { id } = this.props.params;
    client.get(`${URL_CONFIG.boats_path}/${id}`).then(res => {
      this.setState({ boat: BoatUtil.mapBoat(res) });
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

    //Map _destroy for deleted images
    if (typeof this.state.boat.boat_images != "undefined" && this.state.boat.boat_images.length > 0) {
      var index = this.state.boat_images.length;
      this.state.boat.boat_images.map(boat_image => {
        if (boat_image._destroy) {
          boatFormData.append(`boat[boat_images_attributes][${index}][id]`, boat_image.id);
          boatFormData.append(`boat[boat_images_attributes][${index}][_destroy]`, true);
          index++;
        }
      });
    }
    if (typeof boat.primary_image_id != "undefined") {
      boatFormData.append("boat[primary_image_id]", boat.primary_image_id);
    }

    let { boats_path } = URL_CONFIG;

    client.putFormData(`${boats_path}/${this.props.params.id}`, boatFormData).then(
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

  onSelectPrimaryImage(imageId) {
    let { boat } = this.state;
    if (typeof boat.primary_image_id == "undefined") {
      boat.primary_image_id = imageId;
    }
  }

  onRemoveImage(imageId) {
    var newState = this.state;
    var boat_image = newState.boat.boat_images.filter(function(boat_image) {
      return boat_image.id == imageId;
    })[0];
    boat_image._destroy = true;
    this.setState(newState);
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
    const { boat, boat_images, errors } = this.state;
    return (
      <div>
        <BoatShareForm
          title="Edit Boat"
          submitBtn="Save"
          ref={c => (this.boatShareForm = c)}
          errors={errors}
          onSubmitFn={::this.onSubmitFn}
          onCancelFn={::this.onCancelFn}
        >
          <BoatForm
            parent={this}
            toBeUploadImages={boat_images}
            boat={boat}
            onSelectPrimaryImage={::this.onSelectPrimaryImage}
            onRemoveImage={::this.onRemoveImage}
          />
        </BoatShareForm>
        <BoatFuel fetchBoat={::this.fetchBoat} boat={boat} />
      </div>
    );
  }
}
