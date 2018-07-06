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

export default class LessonForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.lesson;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.lesson);
  }

  handleChangeName(e) {
    this.props.parent.handleFieldChange("name", e.target.value);
  }

  handleChangeDescription(e) {
    this.props.parent.handleFieldChange("description", e.target.value);
  }

  handleChangePrice(e) {
    this.props.parent.handleFieldChange("price", e.target.value);
  }

  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              placeholder="Name"
              autoFocus
              value={this.state.name}
              onChange={::this.handleChangeName}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Description <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              placeholder="Description"
              componentClass="textarea"
              rows="3"
              value={this.state.description}
              onChange={::this.handleChangeDescription}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Price <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Name"
              autoFocus
              value={this.state.price}
              onChange={::this.handleChangePrice}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
