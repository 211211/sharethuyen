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

export default class BoatAmenityEditForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      boat_amenity: {
        name: "",
        icon: "",
        thumb_url: "",
        image_url: "",
        created_at: ""
      }
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.boat_amenities_path}/${id}`).then(res => {
      this.setState({
        boat_amenity: {
          name: res.name,
          icon: res.icon,
          thumb_url: res.thumb_url,
          image_url: res.image_url,
          created_at: res.created_at
        }
      });
    });
  }

  onSubmitFn() {
    this.setState({
      errors: {}
    });
    let { boat_amenity } = this.state;
    var formData = new FormData();
    formData.append("boat_amenity[name]", boat_amenity.name.trim());
    formData.append("boat_amenity[icon]", boat_amenity.icon);
    let { boat_amenities_path } = URL_CONFIG;
    $.ajax({
      url: `${boat_amenities_path}/${this.props.params.id}`,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "PUT"
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
    this.props.router.push(`${URL_CONFIG.boat_amenities_path}`);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.boat_amenity[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Edit Boat Amenity"
        submitBtn="Save"
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <BoatAmenityForm parent={this} boat_amenity={this.state.boat_amenity} />
      </BoatShareForm>
    );
  }
}
