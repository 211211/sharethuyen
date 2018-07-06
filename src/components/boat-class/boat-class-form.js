import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";
import { CirclePicker } from "react-color";
import Toggle from "react-toggle";

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

import BoatClassUtil from "./boat-class-util";

export default class BoatClassForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = BoatClassUtil.mapBoatClass(props.boatClass);
    this.state.displayColorPicker = false;
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState = BoatClassUtil.mapBoatClass(nextProps.boatClass);
    newState.displayColorPicker = false;
    this.setState(newState);
  }

  handleOpenColorPicker() {
    var newState = this.state;
    newState.displayColorPicker = true;
    this.setState(newState);
  }

  handleCloseColorPicker() {
    var newState = this.state;
    newState.displayColorPicker = false;
    this.setState(newState);
  }

  handleFieldChange(e) {
    const { target } = e;
    if (target.type === "checkbox") {
      const value = target.checked;
      this.props.parent.handleFieldChange(target.name, value);
    } else {
      this.props.parent.handleFieldChange(target.name, target.value);
    }
  }

  handleChangeColorHex(color) {
    this.props.parent.handleFieldChange("color_hex", color.hex);
  }

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: `${this.state.color_hex}`
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        },
        pickerPopup: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)"
        }
      }
    });

    return (
      <Form horizontal>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Class Name <span className="req-field">*</span>
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              placeholder="Class Name"
              autoFocus
              value={this.state.name}
              name="name"
              onChange={::this.handleFieldChange}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Color Hex #
          </Col>
          <Col sm={9}>
            <div style={styles.swatch} onClick={::this.handleOpenColorPicker}>
              <div style={styles.color} />
            </div>
            {this.state.displayColorPicker ? (
              <div style={styles.popover}>
                <div style={styles.cover} onClick={::this.handleCloseColorPicker} />
                <CirclePicker
                  style={styles.pickerPopup}
                  color={this.state.color_hex}
                  name="color_hex"
                  onChangeComplete={::this.handleChangeColorHex}
                />
              </div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Order
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              placeholder="Order"
              value={this.state.order_number}
              name="order_number"
              onChange={::this.handleFieldChange}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Admin Use
          </Col>
          <Col sm={9}>
            <Toggle name="admin_use" checked={this.state.admin_use} onChange={::this.handleFieldChange} />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
