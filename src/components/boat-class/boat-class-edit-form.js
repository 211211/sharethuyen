import React from "react";

import BoatShareForm from "../_core/boat-share-form";
import BoatClassForm from "./boat-class-form";
import BoatClassUtil from "./boat-class-util";
import { URL_CONFIG } from "../../common/config.js";

export default class BoatClassEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      boatClass: BoatClassUtil.mapBoatClass({})
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.boat_classes_path}/${id}`).then(res => {
      var newState = this.state;
      newState.boatClass = BoatClassUtil.mapBoatClass(res);
      this.setState(newState);
    });
  }

  onSubmitFn() {
    this.boatShareForm.setSubmitDisable(true);
    this.setState({
      errors: {}
    });
    let boatClass = this.state.boatClass;
    $.ajax({
      url: `${URL_CONFIG.boat_classes_path}/${this.props.params.id}`,
      type: "PUT",
      data: {
        boat_class: boatClass
      }
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
    this.props.router.push(`${URL_CONFIG.boat_classes_path}`);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.boatClass[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Edit Boat Class"
        submitBtn="Save"
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
