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

export default class LessonEditForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      errors: {},
      lesson: {
        name: "",
        price: "",
        description: ""
      }
    };
  }

  componentDidMount() {
    let { id } = this.props.params;
    $.getJSON(`${URL_CONFIG.lessons_path}/${id}`).then(res => {
      this.setState({
        lesson: {
          name: res.name,
          description: res.description,
          price: res.price
        }
      });
    });
  }

  onSubmitFn() {
    this.setState({
      errors: {}
    });
    let { lesson } = this.state;
    var formData = new FormData();
    formData.append("lesson[name]", lesson.name.trim());
    formData.append("lesson[description]", lesson.description);
    formData.append("lesson[price]", lesson.price);
    let { lessons_path } = URL_CONFIG;
    $.ajax({
      url: `${lessons_path}/${this.props.params.id}`,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: "PUT"
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
    this.props.router.push(`${URL_CONFIG.lessons_path}`);
  }

  handleFieldChange(fieldId, value) {
    var newState = this.state;
    newState.lesson[fieldId] = value;
    this.setState(newState);
  }

  render() {
    return (
      <BoatShareForm
        title="Edit Lesson"
        submitBtn="Save"
        errors={this.state.errors}
        onSubmitFn={::this.onSubmitFn}
        onCancelFn={::this.onCancelFn}
      >
        <LessonForm parent={this} lesson={this.state.lesson} />
      </BoatShareForm>
    );
  }
}
