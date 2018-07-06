import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import {
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Icon,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelFooter,
  Grid,
  Row
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";

export default class SettingHoliday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      holidays: this.transformHolidayData(props.holidays)
    };
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.state;
    newState.holidays = this.transformHolidayData(nextProps.holidays);
    this.setState(newState);
  }

  transformHolidayData(holidays) {
    holidays.forEach(holiday => {
      if (typeof holiday.date == "string") {
        holiday.date = moment(holiday.date);
      }
    });
    return holidays;
  }

  handleChangeHolidayName(holiday, e) {
    let newState = this.state;
    holiday.name = e.target.value;
    this.setState(newState);
  }

  handleChangeHoliday(holiday, val) {
    if (val._isValid) {
      let newState = this.state;
      holiday.date = val;
      this.setState(newState);
    }
  }

  render() {
    let { holidays } = this.state;
    return (
      <div>
        <Col md={12}>
          <h4 className="section-form-title">Holidays Configuration</h4>
        </Col>
        {holidays.map((holiday, index) => {
          return (
            <FormGroup key={index}>
              <Col xs={4} xsOffset={1}>
                <FormControl
                  type="text"
                  value={holiday.name}
                  placeholder="Name"
                  onChange={e => {
                    this.handleChangeHolidayName(holiday, e);
                  }}
                />
              </Col>
              <Col xs={3}>
                <DatePicker
                  selected={holiday.date}
                  onChange={val => {
                    this.handleChangeHoliday(holiday, val);
                  }}
                />
              </Col>
              <Col xs={3}>
                <Button
                  bsStyle="red"
                  onClick={() => {
                    this.props.handleRemoveHoliday(holiday);
                  }}
                >
                  Remove
                </Button>
              </Col>
            </FormGroup>
          );
        })}
        <Col md={12} mdOffset={1}>
          <Button outlined bsStyle="info" onClick={this.props.handleAddHoliday}>
            Add Holiday
          </Button>
        </Col>
      </div>
    );
  }
}
