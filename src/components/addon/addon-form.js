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

export default class AddonForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addon: props.addon
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      addon: nextProps.addon
    });
  }

  handleChangeField(e) {
    const { name, value } = e.target;
    this.props.parent.handleFieldChange(name, value);
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
              name="name"
              autoFocus
              value={this.state.addon.name}
              onChange={::this.handleChangeField}
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
              placeholder="Price"
              name="price"
              autoFocus
              value={this.state.addon.price}
              onChange={::this.handleChangeField}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Quantity <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Quantity"
              name="quantity"
              autoFocus
              value={this.state.addon.quantity}
              onChange={::this.handleChangeField}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Price Strategy <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              tabIndex="6"
              componentClass="select"
              placeholder="Price Strategy"
              name="price_strategy"
              value={this.state.addon.price_strategy}
              onChange={::this.handleChangeField}
            >
              <option value="per_booking">Per Booking</option>
              <option value="per_date">Per Date</option>
            </FormControl>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
