import React from "react";

import { Form, FormGroup, Col, Row, Button, FormControl, ControlLabel, Image } from "@sketchpixy/rubix";

export default class BoatDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.mapBoat(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.mapBoat(nextProps));
  }

  mapBoat(props) {
    return {
      id: props.boat ? props.boat.id : "",
      name: props.boat ? props.boat.name : "",
      engine_hours: props.boat ? props.boat.engine_hours : "",
      primary_image: props.boat && props.boat.primary_image ? props.boat.primary_image : ""
    };
  }

  render() {
    if (!this.state.id) {
      return (
        <Form horizontal>
          <Col sm={3} />
          <Col sm={9}>
            <em>No boat assigned yet</em>
          </Col>
        </Form>
      );
    }
    return (
      <Form horizontal>
        <Col sm={3} componentClass={ControlLabel}>
          Name
        </Col>
        <Col sm={9}>
          <FormControl.Static>{this.state.name}</FormControl.Static>
        </Col>

        <Col sm={4} smOffset={3}>
          <Image responsive src={this.state.primary_image} />
        </Col>
      </Form>
    );
  }
}
