import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import Select from "react-select";
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

import { URL_CONFIG, CONSTANT, RESPONSE_CODE } from "../common/config";
import ModalConfirm from "../components/_core/modal-confirm";
import client from "../common/http-client";
import SeafairDates from "../components/booking-settings/seafair-setting";
import util from "../common/util";
import { map, includes } from "lodash/collection";
import { inject, observer } from "mobx-react";
import Util from "../common/util";
import LastReservation from "../components/booking-settings/last-reservation-setting";

@inject("store")
export default class BookingSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      booking_settings: {
        seafair_dates: {},
        booking_reserve_hours: 0,
        booking_rules: []
      },
      second_booking_depart_from: "",
      second_booking_time_before_hand: 30,
      block_out_rules: [],
      boat_classes: [],
      boats: [],
      openUnassignPopup: false,
      num_of_assigned_boat: 0,
      last_reservation_by_date: {},
      reserve_time_for_waitlist: 0
    };
  }

  componentDidMount() {
    this.requestVars();
    client.get(URL_CONFIG.admin_boat_classes_search_path).then(data => {
      if (data && data.length > 0) {
        this.setState({
          boat_classes: data
        });
      }
    });
    client.get(URL_CONFIG.boats_path).then(data => {
      if (data && data.boats && data.boats.length > 0) {
        this.setState({
          boats: data.boats
        });
      }
    });
  }

  requestVars() {
    const vars =
      "booking_settings,block_out_rules,second_booking_depart_from,second_booking_time_before_hand,last_reservation_by_date,reserve_time_for_waitlist";
    return client.get(`${URL_CONFIG.find_batch_path}?vars=${vars}`).then(res => {
      let {
        booking_settings,
        block_out_rules,
        second_booking_depart_from,
        last_reservation_by_date,
        second_booking_time_before_hand,
        reserve_time_for_waitlist
      } = this.state;
      if (res && res.booking_settings) {
        booking_settings = this.transformBookingSetting(JSON.parse(res.booking_settings));
      }
      if (res && res.block_out_rules) {
        block_out_rules = JSON.parse(res.block_out_rules);
      }
      if (res && res.second_booking_depart_from) {
        second_booking_depart_from = Util.convertSecToTime(res.second_booking_depart_from);
      }
      if (res && res.last_reservation_by_date) {
        last_reservation_by_date = this.transformLastReservation(res.last_reservation_by_date);
      }
      if (res && res.second_booking_time_before_hand) {
        second_booking_time_before_hand = res.second_booking_time_before_hand;
      }
      if (res && res.reserve_time_for_waitlist) {
        reserve_time_for_waitlist = res.reserve_time_for_waitlist;
      }
      this.setState({
        booking_settings,
        block_out_rules,
        second_booking_depart_from,
        last_reservation_by_date,
        second_booking_time_before_hand,
        reserve_time_for_waitlist
      });
    });
  }

  transformLastReservation(last_reservation_by_date) {
    let result = {};
    Object.keys(last_reservation_by_date).forEach(dayOfWeek => {
      if (last_reservation_by_date[dayOfWeek] && last_reservation_by_date[dayOfWeek] > 0) {
        result[dayOfWeek] = Util.convertSecToTime(last_reservation_by_date[dayOfWeek]);
      } else {
        result[dayOfWeek] = "";
      }
    });
    return result;
  }

  transformBookingSetting(booking_settings) {
    const seafair_dates = booking_settings.seafair_dates || {};
    const booking_rules = booking_settings.booking_rules || {};
    var transformedBookingSettings = Object.assign({}, booking_settings, {
      booking_rules: booking_rules.map(rule => {
        return {
          start_date: moment(rule.start_date),
          end_date: moment(rule.end_date),
          deadline_date: moment(rule.deadline_date)
        };
      }),
      seafair_dates: {
        start_date: seafair_dates.start_date ? moment(seafair_dates.start_date) : undefined,
        end_date: seafair_dates.end_date ? moment(seafair_dates.end_date) : undefined
      }
    });
    return transformedBookingSettings;
  }

  transformSubmitData() {
    let settings = [];
    const {
      booking_settings,
      block_out_rules,
      second_booking_depart_from,
      second_booking_time_before_hand,
      last_reservation_by_date,
      reserve_time_for_waitlist
    } = this.state;
    const seafair_dates = booking_settings.seafair_dates || {};
    const booking_rules = booking_settings.booking_rules || {};
    let second_booking_depart_from_val = "";
    if (second_booking_depart_from && second_booking_depart_from.length > 0) {
      second_booking_depart_from_val = Util.convertTimeToSec(second_booking_depart_from);
    }
    const submitBookingSettings = Object.assign({}, booking_settings, {
      booking_rules: booking_rules.map(rule => {
        return {
          start_date: rule.start_date.format(CONSTANT.DATE_FORMAT),
          end_date: rule.end_date.format(CONSTANT.DATE_FORMAT),
          deadline_date: rule.deadline_date.format(CONSTANT.DATE_FORMAT)
        };
      }),
      seafair_dates: {
        start_date: seafair_dates.start_date ? seafair_dates.start_date.format(CONSTANT.DATE_FORMAT) : "",
        end_date: seafair_dates.end_date ? seafair_dates.end_date.format(CONSTANT.DATE_FORMAT) : ""
      }
    });
    settings.push({
      key: "booking_settings",
      value: JSON.stringify(submitBookingSettings)
    });
    settings.push({
      key: "block_out_rules",
      value: JSON.stringify(block_out_rules)
    });
    settings.push({
      key: "second_booking_depart_from",
      value: second_booking_depart_from_val
    });
    settings.push({
      key: "last_reservation_by_date",
      value: this.transformSubmitLastReservation(last_reservation_by_date)
    });
    settings.push({
      key: "second_booking_time_before_hand",
      value: parseInt(second_booking_time_before_hand)
    });
    settings.push({
      key: "reserve_time_for_waitlist",
      value: parseInt(reserve_time_for_waitlist)
    });
    return settings;
  }

  transformSubmitLastReservation(last_reservation_by_date) {
    let result = {};
    Object.keys(last_reservation_by_date).forEach(dayOfWeek => {
      if (last_reservation_by_date[dayOfWeek] && last_reservation_by_date[dayOfWeek].length > 0) {
        result[dayOfWeek] = Util.convertTimeToSec(last_reservation_by_date[dayOfWeek]);
      } else {
        result[dayOfWeek] = "";
      }
    });
    return result;
  }

  setSubmitDisable(val) {
    var newState = this.state;
    newState.submitDisabled = val;
    this.setState(newState);
  }

  handleChangeBookingRule(booking_rule, field_name, val) {
    if (val._isValid) {
      booking_rule[field_name] = val;
      this.setState(this.state);
    }
  }

  onSubmitFn() {
    this.setSubmitDisable(true);
    client
      .put(URL_CONFIG.update_batch_settings_path, {
        settings: this.transformSubmitData()
      })
      .then(
        res => {
          util.growl(res.message);
          this.props.store.updateSettings(res.settings);
          this.setSubmitDisable(false);
        },
        response => {
          this.setSubmitDisable(false);
        }
      );
  }

  handleChangeBookingReserveHours(e) {
    let { booking_settings } = this.state;
    booking_settings.booking_reserve_hours = e.target.value;
    this.setState({ booking_settings });
  }

  handleChangeInput(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleRemoveBookingRule(booking_rule) {
    let { booking_settings } = this.state;
    let { booking_rules } = booking_settings;
    let pos = booking_rules.indexOf(booking_rule);
    booking_rules.splice(pos, 1);
    this.setState(this.state);
  }

  handleAddBookingRule() {
    let { booking_rules } = this.state.booking_settings;
    booking_rules.push({
      deadline_date: moment(),
      start_date: moment(),
      end_date: moment()
    });
    this.setState(this.state);
  }

  onChangeRuleKind(rule, e) {
    rule.kind = e.target.value;
    this.setState(this.state);
  }

  removeDate(dates, index) {
    dates.splice(index, 1);
    this.setState(this.state);
  }

  handleAddBlockOutRule() {
    let { block_out_rules } = this.state;
    block_out_rules.push({
      kind: "all",
      dates: []
    });
    this.setState({ block_out_rules });
  }

  handleRemoveBlockOutRule(block_out_rule) {
    let { block_out_rules } = this.state;
    let pos = block_out_rules.indexOf(block_out_rule);
    block_out_rules.splice(pos, 1);
    this.setState(this.state);
  }

  handleAddDate(rule, date) {
    const date_formatted = date.format(CONSTANT.DATE_FORMAT);
    rule.dates.push(date_formatted);
    this.setState(this.state);
    this.checkBoatAssigned(rule, date_formatted);
  }

  checkBoatAssigned(rule, date) {
    const { kind } = rule;
    let id = 0;
    if (kind === "boat_class") {
      id = rule.boat_class_id;
    } else if (kind === "boat") {
      id = rule.boat_id;
    }
    client.get(`admin/booking_settings/check_boat_assigned?id=${id}&kind=${kind}&date=${date}`).then(res => {
      if (res && res.num_of_assigned_boat > 0) {
        this.setState({
          num_of_assigned_boat: res.num_of_assigned_boat,
          boat_assigned_data: {
            id: id,
            kind: kind,
            date: date
          }
        });
        this.confirmResetModal.open();
      }
    });
  }

  unassignBoat() {
    const { boat_assigned_data } = this.state;
    const { id, kind, date } = boat_assigned_data;
    this.confirmResetModal.setLoading(true);
    client
      .post(`admin/booking_settings/unassign_boat`, {
        id: id,
        kind: kind,
        date: date
      })
      .then(
        response => {
          this.confirmResetModal.setLoading(false);
          this.confirmResetModal.close();
        },
        response => {
          if (response.status == 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            }
          }
          this.confirmResetModal.setLoading(false);
        }
      );
  }

  onChangeBoatClass(rule, e) {
    rule.boat_class_id = e.target.value;
    this.setState(this.state);
  }

  onChangeBoat(rule, e) {
    rule.boat_id = e.target.value;
    this.setState(this.state);
  }

  onChangeSeafairDate(field, value) {
    let newState = this.state;
    newState.booking_settings.seafair_dates[field] = value;
    this.setState(newState);
  }

  changeLastReservation(dayOfWeek, value) {
    const { last_reservation_by_date } = this.state;
    last_reservation_by_date[dayOfWeek] = value;
    this.setState({ last_reservation_by_date });
  }

  handleChangeNotes(rule, e) {
    rule.notes = e.target.value;
    this.setState(this.state);
  }

  render() {
    const { onChangeSeafairDate, changeLastReservation } = this;
    const departureTimes = CONSTANT.departureTimes;
    const {
      booking_settings,
      block_out_rules,
      boat_classes,
      boats,
      num_of_assigned_boat,
      second_booking_depart_from,
      second_booking_time_before_hand,
      last_reservation_by_date,
      reserve_time_for_waitlist
    } = this.state;
    const { booking_reserve_hours, booking_rules, seafair_dates } = booking_settings;
    const unassign_message = `Do you want to unassign boat for ${num_of_assigned_boat} booking(s)?`;
    const blockOutKinds = [
      {
        name: "all",
        display: "All"
      },
      {
        name: "boat_class",
        display: "Boat Class"
      },
      {
        name: "boat",
        display: "Boat"
      }
    ];
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid>
              <Form horizontal>
                <Row className="panel-header">
                  <Col md={12}>
                    <Col md={6}>
                      <h3>Booking Settings</h3>
                    </Col>
                  </Col>
                </Row>
                <SeafairDates seafair_dates={seafair_dates} onChangeSeafairDate={onChangeSeafairDate.bind(this)} />
                <LastReservation
                  last_reservation_by_date={last_reservation_by_date}
                  changeLastReservation={changeLastReservation.bind(this)}
                />
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Col md={12}>
                        <h4 className="section-form-title">Two Bookings Per Day</h4>
                      </Col>
                      <FormGroup>
                        <Col md={12}>
                          <Col sm={3} componentClass={ControlLabel}>
                            Departure from
                          </Col>
                          <Col sm={9}>
                            <FormControl
                              componentClass="select"
                              value={second_booking_depart_from}
                              name="second_booking_depart_from"
                              onChange={::this.handleChangeInput}
                            >
                              {departureTimes.map(departureTime => {
                                return (
                                  <option key={departureTime} value={departureTime}>
                                    {departureTime}
                                  </option>
                                );
                              })}
                            </FormControl>
                            <div>
                              <small>
                                Those bookings departure from this time, the boat can be used for other booking
                              </small>
                            </div>
                            <div>
                              <small>Leave this field blank to turn it off</small>
                            </div>
                          </Col>
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md={12}>
                          <Col sm={3} componentClass={ControlLabel}>
                            Boat need return before
                          </Col>
                          <Col sm={9}>
                            <FormControl
                              componentClass="select"
                              value={second_booking_time_before_hand}
                              name="second_booking_time_before_hand"
                              onChange={::this.handleChangeInput}
                            >
                              {[30, 40, 50, 60].map(min => {
                                return (
                                  <option key={min} value={min}>
                                    {min} mins
                                  </option>
                                );
                              })}
                            </FormControl>
                            <small>
                              Boat need to return before {second_booking_time_before_hand} minutes for next booking
                            </small>
                          </Col>
                        </Col>
                      </FormGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Col md={12}>
                        <h4 className="section-form-title">Booking Reserve Rule</h4>
                      </Col>
                      <FormGroup>
                        <Col md={12}>
                          <Col sm={3} componentClass={ControlLabel}>
                            Reserve booking hour(s)
                          </Col>
                          <Col sm={9}>
                            <FormControl
                              type="number"
                              value={booking_reserve_hours}
                              onChange={::this.handleChangeBookingReserveHours}
                            />
                            <div>
                              <small>
                                {
                                  "(x < 0) need to reserve booking before x hour(s) after the cut off 10am on the same date"
                                }
                              </small>
                            </div>
                            <small>{"(x = 0) to turn off this rule"}</small>
                            <div>
                              <small>
                                {"(x > 0) need to reserve booking x hour(s) before 10am on the selected date"}
                              </small>
                            </div>
                          </Col>
                        </Col>
                      </FormGroup>
                    </FormGroup>
                    <FormGroup>
                      <Col md={12}>
                        <h4 className="section-form-title">Reserve Time For Wailist</h4>
                      </Col>
                      <FormGroup>
                        <Col md={12}>
                          <Col sm={3} componentClass={ControlLabel}>
                            Minute(s)
                          </Col>
                          <Col sm={9}>
                            <FormControl
                              type="number"
                              value={reserve_time_for_waitlist}
                              name="reserve_time_for_waitlist"
                              onChange={::this.handleChangeInput}
                            />
                            <div>
                              <small>
                                When stock goes back due to cancelled booking, waitlist user will have{" "}
                                {reserve_time_for_waitlist} minutes before it is available to other members
                              </small>
                            </div>
                            <small>{"Set to 0 to turn off this rule"}</small>
                          </Col>
                        </Col>
                      </FormGroup>
                    </FormGroup>
                    <FormGroup>
                      <Col md={12} style={{ marginBottom: 10 }}>
                        <h4 className="section-form-title">Booking Range With Deadline</h4>
                        <em>
                          Setting booking deadline with date range. Booking between <b>Start Date</b> and{" "}
                          <b>End Date</b> need to reserve before <b>Deadline Date</b>
                        </em>
                      </Col>
                      {booking_rules &&
                        booking_rules.length > 0 && (
                          <Col md={12} style={{ paddingLeft: 50 }}>
                            <FormGroup>
                              <Col xs={3}>Start Date</Col>
                              <Col xs={3}>End Date</Col>
                              <Col xs={3}>Deadline Date</Col>
                            </FormGroup>
                          </Col>
                        )}
                      {booking_rules.map((booking_rule, index) => {
                        return (
                          <Col md={12} style={{ paddingLeft: 50 }} key={index}>
                            <FormGroup>
                              <Col xs={3}>
                                <DatePicker
                                  selected={booking_rule.start_date}
                                  onChange={val => {
                                    this.handleChangeBookingRule(booking_rule, "start_date", val);
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <DatePicker
                                  selected={booking_rule.end_date}
                                  onChange={val => {
                                    this.handleChangeBookingRule(booking_rule, "end_date", val);
                                  }}
                                />
                              </Col>
                              <Col xs={3}>
                                <DatePicker
                                  selected={booking_rule.deadline_date}
                                  onChange={val => {
                                    this.handleChangeBookingRule(booking_rule, "deadline_date", val);
                                  }}
                                />
                              </Col>
                              <Col xs={2}>
                                <Button
                                  bsStyle="red"
                                  onClick={() => {
                                    this.handleRemoveBookingRule(booking_rule);
                                  }}
                                >
                                  Remove
                                </Button>
                              </Col>
                            </FormGroup>
                          </Col>
                        );
                      })}
                      <Col md={12} style={{ paddingLeft: 50 }}>
                        <Button outlined bsStyle="info" onClick={::this.handleAddBookingRule}>
                          Add Booking Rule
                        </Button>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Col md={12}>
                        <h4 className="section-form-title">Block Out Rules</h4>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      {block_out_rules &&
                        block_out_rules.length > 0 && (
                          <Col md={12} style={{ paddingLeft: 50 }}>
                            <FormGroup>
                              <Col xs={3}>Kind</Col>
                              <Col xs={3}>Boat / Boat Class</Col>
                              <Col xs={3}>Block Dates</Col>
                            </FormGroup>
                          </Col>
                        )}
                      {block_out_rules.map((rule, index) => {
                        return (
                          <Col>
                            <Col md={12} style={{ paddingLeft: 50 }} key={index}>
                              <FormGroup>
                                <Col xs={3}>
                                  <FormControl
                                    componentClass="select"
                                    placeholder="Select Block Out Kind"
                                    value={rule.kind}
                                    onChange={e => {
                                      this.onChangeRuleKind(rule, e);
                                    }}
                                  >
                                    {blockOutKinds.map((kind, index) => {
                                      return (
                                        <option key={kind.name} value={kind.name}>
                                          {kind.display}
                                        </option>
                                      );
                                    })}
                                  </FormControl>
                                </Col>
                                <Col xs={3}>
                                  {rule.kind === "boat_class" && (
                                    <FormControl
                                      componentClass="select"
                                      placeholder="Select Boat Class"
                                      value={rule.boat_class_id}
                                      onChange={e => {
                                        this.onChangeBoatClass(rule, e);
                                      }}
                                    >
                                      <option value="-1">- Please choose -</option>
                                      {boat_classes.map((boat_class, index) => {
                                        return (
                                          <option key={boat_class.id} value={boat_class.id}>
                                            {boat_class.name}
                                          </option>
                                        );
                                      })}
                                    </FormControl>
                                  )}
                                  {rule.kind === "boat" && (
                                    <FormControl
                                      componentClass="select"
                                      placeholder="Select Boat"
                                      value={rule.boat_id}
                                      onChange={e => {
                                        this.onChangeBoat(rule, e);
                                      }}
                                    >
                                      <option value="-1">- Please choose -</option>
                                      {boats.map((boat, index) => {
                                        return (
                                          <option key={boat.id} value={boat.id}>
                                            {boat.name}
                                          </option>
                                        );
                                      })}
                                    </FormControl>
                                  )}
                                </Col>
                                <Col xs={3}>
                                  {rule.dates.map((date, index) => {
                                    return (
                                      <span
                                        key={index}
                                        style={{
                                          marginLeft: 5,
                                          marginBottom: 5,
                                          backgroundColor: "rgba(0, 126, 255, 0.08)",
                                          borderRadius: 2,
                                          border: "1px solid rgba(0, 126, 255, 0.24)",
                                          color: "#007eff",
                                          display: "inline-block"
                                        }}
                                      >
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            borderRight: "1px solid #c2e0ff",
                                            padding: "1px 5px 3px"
                                          }}
                                          onClick={e => this.removeDate(rule.dates, index)}
                                        >
                                          ×
                                        </span>
                                        <span
                                          style={{
                                            borderRadius: 2,
                                            display: "inline-block",
                                            margin: "0 5px"
                                          }}
                                        >
                                          {date}
                                        </span>
                                      </span>
                                    );
                                  })}
                                  <DatePicker
                                    customInput={<CustomDatePicker />}
                                    onChange={val => {
                                      this.handleAddDate(rule, val);
                                    }}
                                  />
                                </Col>
                                <Col xs={2}>
                                  <Button
                                    bsStyle="red"
                                    onClick={() => {
                                      this.handleRemoveBlockOutRule(rule);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Col>
                              </FormGroup>
                            </Col>
                            <Col md={12} style={{ paddingLeft: 50, paddingBottom: 10 }}>
                              <FormGroup>
                                <Col xs={9}>
                                  <FormControl
                                    placeholder="Notes"
                                    componentClass="textarea"
                                    rows="2"
                                    value={rule.notes}
                                    onChange={e => {
                                      this.handleChangeNotes(rule, e);
                                    }}
                                    maxLength={35}
                                  />
                                </Col>
                              </FormGroup>
                            </Col>
                          </Col>
                        );
                      })}
                      <Col md={12} style={{ paddingLeft: 50 }}>
                        <Button outlined bsStyle="info" onClick={::this.handleAddBlockOutRule}>
                          Add Block Out Rule
                        </Button>
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Grid>
          </PanelBody>
          <PanelFooter className="text-right">
            <Grid>
              <Row>
                <Col md={12} style={{ marginBottom: 10 }}>
                  <Button outlined bsStyle="primary" onClick={::this.onSubmitFn} disabled={this.state.submitDisabled}>
                    Update
                  </Button>
                </Col>
              </Row>
            </Grid>
          </PanelFooter>
        </Panel>
        <ModalConfirm
          message={unassign_message}
          ref={c => (this.confirmResetModal = c)}
          resolvedFn={::this.unassignBoat}
        />
      </PanelContainer>
    );
  }
}

class CustomDatePicker extends React.Component {
  render() {
    return (
      <span
        style={{
          marginLeft: 5,
          marginBottom: 5,
          borderRadius: 2,
          border: "1px solid rgba(0, 126, 255, 0.24)",
          color: "#007eff",
          display: "inline-block",
          padding: "0 20px",
          cursor: "pointer"
        }}
        onClick={this.props.onClick}
      >
        + Add
      </span>
    );
  }
}
