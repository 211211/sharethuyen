import React from "react";
import DatePicker from "react-datepicker";
import { Col, FormGroup, FormControl, ControlLabel, Row } from "@sketchpixy/rubix";

export default class SeafairDates extends React.Component {
  render() {
    const { seafair_dates, onChangeSeafairDate } = this.props;
    const { start_date, end_date } = seafair_dates;

    const { _onChangeStartDate, _onChangeEndDate } = this;
    return (
      <Row>
        <Col md={12}>
          <FormGroup>
            <Col md={12}>
              <h4 className="section-form-title">Seafair Dates</h4>
            </Col>
            <FormGroup>
              <Col md={12}>
                <Col sm={3} componentClass={ControlLabel}>
                  Start Date
                </Col>
                <Col sm={9}>
                  <DatePicker selected={start_date} onChange={_onChangeStartDate.bind(this)} />
                </Col>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col md={12}>
                <Col sm={3} componentClass={ControlLabel}>
                  End Date
                </Col>
                <Col sm={9}>
                  <DatePicker selected={seafair_dates.end_date} onChange={_onChangeEndDate.bind(this)} />
                </Col>
              </Col>
            </FormGroup>
          </FormGroup>
        </Col>
      </Row>
    );
  }

  _onChangeStartDate(start_date) {
    this.props.onChangeSeafairDate("start_date", start_date);
  }

  _onChangeEndDate(end_date) {
    this.props.onChangeSeafairDate("end_date", end_date);
  }
}
