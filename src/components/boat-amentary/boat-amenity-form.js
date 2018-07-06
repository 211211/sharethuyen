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

import BoatShareImg from "../_core/boat-share-img";

export default class BoatAmenityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.boat_amenity;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.boat_amenity);
  }

  handleChangeName(e) {
    this.props.parent.handleFieldChange("name", e.target.value);
  }

  handleChangeFile(e) {
    this.props.parent.handleFieldChange("icon", e.target.files[0]);
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
            Icon <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl type="file" onChange={::this.handleChangeFile} />
          </Col>
        </FormGroup>
        {(() => {
          if (this.props.boat_amenity.image_url && this.props.boat_amenity.image_url.length > 0) {
            return (
              <FormGroup>
                <Col sm={3} />
                <Col sm={9}>
                  <Col sm={3}>
                    <BoatShareImg image_url={this.props.boat_amenity.image_url} title="Primary" />
                  </Col>
                  <Col sm={2}>
                    <BoatShareImg image_url={this.props.boat_amenity.thumb_url} title="Thumbnail" />
                  </Col>
                </Col>
              </FormGroup>
            );
          }
        })()}
      </Form>
    );
  }
}
