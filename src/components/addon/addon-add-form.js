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

export default class AddonAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      addon: {
        name: "",
        price: 0,
        quantity: 0,
        price_strategy: 0
      }
    };
  }

  onSubmitFn() {
    this.setState({
      errors: {}
    });
    this.boatShareForm.setSubmitDisable(true);
    var submitAddon = AddonUtil.buildSubmitAddon(this.state.addon);
    client.post(URL_CONFIG.addons_path, submitAddon).then(
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
        title="Add Addon"
        submitBtn="Create"
        ref={c => (this.boatShareForm = c)}
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <AddonForm parent={this} addon={this.state.addon} />
      </BoatShareForm>
    );
  }
}
