import React from "react";
import Select from "react-select";
import { inject, observer } from "mobx-react";

import { FormGroup, Col, ControlLabel, Button } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";

@inject("store", "newBookingStore")
@observer
export default class SelectBoatClassFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boat_class: props.boat_class || "",
      boat_classes: [],
      isError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.state;
    newState.boat_class = nextProps.boat_class;

    if (this.state.boat_class) {
      newState.isError = false;
    }
    this.setState(newState);
    this.initDisableBoatClass(nextProps);
  }

  componentDidMount() {
    let { search_boat_classes_path } = URL_CONFIG;
    const { user_side } = this.props;
    if (!user_side) {
      search_boat_classes_path = URL_CONFIG.admin_boat_classes_search_path;
    }
    client.get(`${search_boat_classes_path}`).then(res => {
      var newState = this.state;
      newState.boat_classes = res;
      this.initDisableBoatClass(this.props);
      this.setState(newState);
    });
  }

  //TODO: Init function will help update disabledBoatClass for current_user booking
  initDisableBoatClass(props) {
    let { current_user } = props;
    let { boat_classes } = this.state;

    //It expect the boat_classes was loaded
    //and booking is belonged to current_user
    if (current_user && current_user.boat_class_ids && boat_classes.length > 0) {
      this.disableBoatClasses(current_user.boat_class_ids);
    }
  }

  disableBoatClasses(boat_class_ids) {
    let newState = this.state;
    let { boat_classes } = this.state;
    boat_classes.forEach(boat_class => {
      if (boat_class_ids.indexOf(boat_class.id) == -1) {
        boat_class.disabled = true;
      } else {
        boat_class.disabled = false;
      }
    });
    this.setState(newState);
  }

  valid() {
    if (!this.props.newBookingStore.boat_class) {
      util.growlError("need_to_select_boat_class_before_creating_booking");
      return false;
    }

    return true;
  }

  boatClassRendererFn(option) {
    return (
      <p className="boat-class-select-item">
        <span className="color-swatch-select" style={{ backgroundColor: option.color_hex }} />
        {option.name}
      </p>
    );
  }

  onChangeBoatClass(val) {
    if (val && val.id) {
      this.props.newBookingStore.boat_class = val;
    } else {
      this.props.newBookingStore.boat_class = {};
    }
    this.props.newBookingStore.boatClassChangedMode = CONSTANT.boatClassChangedMode.boatClass;
    this.props.newBookingStore.boat_class_prices = [];
  }

  render() {
    const { user_side } = this.props;
    const { settings } = this.props.store;
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          Boat Class {!user_side && <span className="req-field">*</span>}
        </Col>
        <Col sm={6} className={this.state.isError ? "error" : ""}>
          <Select
            name="boat-class-field"
            value={this.props.newBookingStore.boat_class}
            labelKey="name"
            valueKey="id"
            options={this.state.boat_classes}
            optionRenderer={::this.boatClassRendererFn}
            onChange={::this.onChangeBoatClass}
          />
        </Col>
        {user_side && (
          <Col sm={3}>
            <a
              className="user-side-btn btn btn-default more-about-boat-classes"
              target="_blank"
              href={settings.website_url + "/boat-classes"}
            >
              More about boat classes & Qualification
            </a>
          </Col>
        )}
      </FormGroup>
    );
  }
}
