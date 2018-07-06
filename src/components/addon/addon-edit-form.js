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
import util from "../../common/util";
import BoatShareForm from "../_core/boat-share-form";
import AddonForm from "./addon-form";
import AddonUtil from "./addon-util";

export default class AddonEditForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      addon: {
        id: "",
        name: "",
        price: 0,
        quantity: 0,
        price_strategy: 0
      }
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.addons_path}/${id}`).then(res => {
      this.setState({
        addon: {
          id: res.id,
          name: res.name || "",
          price: res.price || 0,
          quantity: res.quantity || 0,
          price_strategy: res.price_strategy || 0
        }
      });
    });
  }

  onSubmitFn() {
    this.setState({
      errors: {}
    });
    this.boatShareForm.setSubmitDisable(true);
    var submitAddon = AddonUtil.buildSubmitAddon(this.state.addon);
    client.put(`${URL_CONFIG.addons_path}/${this.props.params.id}`, submitAddon).then(
      res => {
        this.boatShareForm.setSubmitDisable(false);
        this.props.router.push(URL_CONFIG.addons_path);
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
    this.props.router.push(URL_CONFIG.addons_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.addon[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Edit Addon"
        submitBtn="Save"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <AddonForm mode="edit" parent={this} addon={this.state.addon} />
      </BoatShareForm>
    );
  }
}
