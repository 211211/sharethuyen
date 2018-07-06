import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";

import { Row, Col, FormControl, ControlLabel } from "@sketchpixy/rubix";

export default class BookingCompleteNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      note: props.note
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      note: nextProps.note
    });
  }

  handleChangeNote(e) {
    var newState = this.state;
    newState.note = e.target.value;
    this.setState(newState);
    this.props.handleChangeNote(e.target.value);
  }

  render() {
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">{this.props.title}</h4>
        </Col>
        <Col sm={3} />
        <Col sm={9}>
          <FormControl componentClass="textarea" rows="3" value={this.state.note} onChange={::this.handleChangeNote} />
        </Col>
      </Row>
    );
  }
}
