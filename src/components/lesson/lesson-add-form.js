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
import LessonForm from "./lesson-form";
import { URL_CONFIG } from "../../common/config";

export default class LessonAddForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      lesson: {
        name: "",
        description: "",
        price: ""
      }
    };
  }

  onSubmitFn() {
    let lesson = this.state.lesson;

    var formData = new FormData();
    formData.append("lesson[name]", lesson.name.trim());
    formData.append("lesson[description]", lesson.description);
    formData.append("lesson[price]", lesson.price);
    $.ajax({
      url: URL_CONFIG.lessons_path,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "POST"
    }).then(
      response => {
        this.props.router.push(URL_CONFIG.lessons_path);
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
    this.props.router.push(URL_CONFIG.lessons_path);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.lesson[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Add Lesson"
        submitBtn="Create"
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <LessonForm parent={this} lesson={this.state.lesson} />
      </BoatShareForm>
    );
  }
}
