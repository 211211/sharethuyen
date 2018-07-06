import React from "react";
import Select from "react-select";

import { FormGroup, Col, ControlLabel } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";

export default class SelectLessonFormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: props.lesson || "",
      lessons: [],
      isError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.state;
    newState.lesson = nextProps.lesson;

    if (this.state.lesson) {
      newState.isError = false;
    }
    this.setState(newState);
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.search_lessons_path}`).then(res => {
      this.setState({
        lessons: res
      });
    });
  }

  valid() {
    if (!this.state.lesson) {
      util.growlError("You need to select a lesson to book");
      return false;
    }

    return true;
  }

  lessonRendererFn(option) {
    return <p className="boat-class-select-item">{option.name}</p>;
  }

  render() {
    return (
      <FormGroup>
        <Col sm={3} componentClass={ControlLabel}>
          Lesson <span className="req-field">*</span>
        </Col>
        <Col sm={6} className={this.state.isError ? "error" : ""}>
          <Select
            name="lesson-field"
            value={this.state.lesson}
            labelKey="name"
            valueKey="id"
            options={this.state.lessons}
            optionRenderer={::this.lessonRendererFn}
            onChange={::this.props.onChangeLesson}
          />
        </Col>
      </FormGroup>
    );
  }
}
