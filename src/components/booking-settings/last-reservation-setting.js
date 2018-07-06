import React from "react";
import DatePicker from "react-datepicker";
import { Col, FormGroup, FormControl, ControlLabel, Row } from "@sketchpixy/rubix";
import { startCase } from "lodash/string";
import { CONSTANT } from "../../common/config";

export default class LastReservation extends React.Component {
  render() {
    const { _handleChangeLastReservation } = this;
    const { last_reservation_by_date } = this.props;
    const reservationTimes = CONSTANT.departureTimes;
    const dayConfigs = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return (
      <Row>
        <Col md={12}>
          <FormGroup>
            <Col md={12}>
              <h4 className="section-form-title">Last Reservation</h4>
            </Col>
            {dayConfigs.map((dayConfig, index) => {
              return (
                <FormGroup key={index}>
                  <Col md={12}>
                    <Col sm={3} componentClass={ControlLabel}>
                      {startCase(dayConfig)}
                    </Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass="select"
                        value={last_reservation_by_date[dayConfig]}
                        onChange={e => {
                          _handleChangeLastReservation.call(this, e, dayConfig);
                        }}
                      >
                        {reservationTimes.map(reservationTime => {
                          return (
                            <option key={reservationTime} value={reservationTime}>
                              {reservationTime}
                            </option>
                          );
                        })}
                      </FormControl>
                    </Col>
                  </Col>
                </FormGroup>
              );
            })}
          </FormGroup>
        </Col>
      </Row>
    );
  }

  _handleChangeLastReservation(e, dayOfWeek) {
    this.props.changeLastReservation(dayOfWeek, e.target.value);
  }
}
