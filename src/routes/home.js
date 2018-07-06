import React from "react";
import Loader from "react-loader";
import DatePicker from "react-datepicker";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer, Icon } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT, state } from "../common/config.js";
import DashboardRedFlag from "../components/dashboard/dashboard-red-flag";
import SelectBoatClass from "../components/_core/select-boat-class";
import client from "../common/http-client";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      boat_class: {
        id: -1,
        name: "VIEW ALL",
        color_hex: "#fff"
      },
      selectedDate: moment(),
      boat_classes: []
    };
  }

  componentDidMount() {
    client.get(URL_CONFIG.admin_boat_classes_search_path).then(res => {
      let newState = this.state;
      newState.boat_classes = res;
      this.setState(newState);
    });
    this.initCalendarFirstTime();

    // Fix calendar popup position
    $("body").addClass("bs-dashboard-screen");
  }

  componentWillUnmount() {
    $("body").removeClass("bs-dashboard-screen");
  }

  initCalendarFirstTime() {
    this.calendar_data = {};
    this.initCalendar();
    let calendar_view = this.calendar.fullCalendar("getView");
    this.calendar_data = {
      start: calendar_view.start,
      end: calendar_view.end,
      timelineView: calendar_view.name
    };
    this.requestCalendarData();
  }

  requestCalendarData(boat_class_id) {
    let newState = this.state;
    newState.loaded = false;
    this.setState(newState);
    this.calendar_data.resources = [];
    this.calendar_data.events = [];
    this.requestToBeAssignedBooking(boat_class_id).then(() => {
      this.requestBoatCalendar(boat_class_id);
    });
  }

  requestToBeAssignedBooking(boat_class_id) {
    let start_date = this.calendar_data.start.format(CONSTANT.DATE_FORMAT);
    let end_date = this.calendar_data.end.format(CONSTANT.DATE_FORMAT);
    let { timelineView } = this.calendar_data;
    return client
      .get(`${URL_CONFIG.booking_not_assign_path}/${start_date}/${end_date}`, {
        boat_class_id: boat_class_id,
        timelineView: timelineView
      })
      .then(
        res => {
          this.buildCalendarEventsFromBookingsNotAssign(res);
        },
        () => {
          this.setState({
            loaded: true
          });
        }
      );
  }

  requestBoatCalendar(boat_class_id) {
    let start_date = this.calendar_data.start.format(CONSTANT.DATE_FORMAT);
    let end_date = this.calendar_data.end.format(CONSTANT.DATE_FORMAT);
    let { timelineView } = this.calendar_data;
    return client
      .get(`${URL_CONFIG.boats_booking_calendar_path}/${start_date}/${end_date}`, {
        boat_class_id: boat_class_id,
        timelineView: timelineView
      })
      .then(
        boats => {
          this.buildCalendarEventsFromBoats(boats);
        },
        () => {
          this.setState({
            loaded: true
          });
        }
      );
  }

  initCalendar() {
    if (this.calendar) {
      this.calendar.fullCalendar("destroy");
    }
    let newState = this.state;
    newState.loaded = true;
    this.setState(newState);
    let { calendar_data } = this;
    this.calendar = $("#calendar").fullCalendar({
      now: calendar_data.start || moment(),
      aspectRatio: 1.8,
      scrollTime: "00:00",
      header: {
        left: "prev,next",
        center: "title",
        right: "timelineDay,timelineWeek,timelineMonth"
      },
      defaultView: calendar_data.timelineView || "timelineDay",
      slotDuration: { days: 1 },
      slotLabelFormat: "ddd MM/DD",
      navLinks: true,
      resourceAreaWidth: "20%",
      resourceLabelText: " ",
      resources: calendar_data.resources,
      events: calendar_data.events,
      displayEventTime: false,
      viewRender: (view, element) => {
        if (
          this.calendar_data.start &&
          (this.calendar_data.start.diff(view.start, "day") != 0 || this.calendar_data.end.diff(view.end, "day") != 0)
        ) {
          this.calendar_data = {
            start: view.start,
            end: view.end,
            timelineView: view.name
          };
          let boat_class_id = this.state.boat_class.id;
          if (boat_class_id != -1) {
            this.requestCalendarData(boat_class_id);
          } else {
            this.requestCalendarData();
          }
        }
      },
      eventRender: (event, element) => {
        if (event && event.booking_id) {
          element.css("cursor", "pointer");
        }
      },
      resourceRender: (resourceObj, labelTds, bodyTds) => {
        if (resourceObj.is_booking) {
          labelTds.css("color", "green");
        }
      },
      eventClick: (calEvent, jsEvent, view) => {
        if (calEvent && calEvent.booking_id) {
          this.props.router.push(`${URL_CONFIG.bookings_path}/${calEvent.booking_id}`);
        }
      },
      eventMouseover: function(calEvent, jsEvent) {
        var tooltip = '<div class="bs-tooltipevent">' + calEvent.title + "</div>";
        var $tooltip = $(tooltip).appendTo("body");
        $(this)
          .mouseover(function(e) {
            $(this).css("z-index", 10000);
            $tooltip.fadeIn("500");
            $tooltip.fadeTo("10", 1.9);
          })
          .mousemove(function(e) {
            $tooltip.css("top", e.pageY + 10);
            $tooltip.css("left", e.pageX + 20);
          })
          .click(function(e) {
            $(".bs-tooltipevent").remove();
          });
      },
      eventMouseout: function(calEvent, jsEvent) {
        $(this).css("z-index", 8);
        $(".bs-tooltipevent").remove();
      }
    });
  }

  onChangeBoatClass(val) {
    var newState = this.state;
    newState.boat_class = val;
    if (val.id != -1) {
      this.requestCalendarData(val.id);
    } else {
      this.requestCalendarData();
    }
  }

  render() {
    const { selectedDate } = this.state;
    return (
      <PanelContainer>
        <Panel>
          <PanelBody>
            <Grid style={{ marginBottom: 10 }}>
              <Row className="panel-header">
                <Col md={12}>
                  <Col md={6}>
                    <h4>Boat Booking Calendar</h4>
                  </Col>
                </Col>
              </Row>
              <Row>
                <DashboardRedFlag />
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col md={12} style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <SelectBoatClass
                      showAllOption="1"
                      boat_class={this.state.boat_class}
                      boat_classes={this.state.boat_classes}
                      onChangeBoatClass={::this.onChangeBoatClass}
                      style={{ marginBottom: 10 }}
                    />
                  </div>
                  <div
                    style={{
                      flex: "0 1 30px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <DatePicker
                      customInput={<CustomDatePicker />}
                      popoverAttachment="bottom right"
                      popoverTargetAttachment="top right"
                      popoverTargetOffset="10px 0"
                      onChange={this.handleChangeDate.bind(this)}
                      onBlur={this.handleOnBlur}
                      selected={selectedDate}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Loader loaded={this.state.loaded} />
                  <div className={this.state.loaded ? "" : "is-loading"}>
                    <div id="calendar" />
                  </div>
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }

  handleChangeDate(selectedDate) {
    const dateInTimeZone = moment(selectedDate.format(CONSTANT.DATE_FORMAT));
    this.calendar.fullCalendar("gotoDate", dateInTimeZone);
    this.setState({ selectedDate });
  }

  buildCalendarEventsFromBookingsNotAssign(bookings) {
    if (!bookings || bookings.length <= 0) return;
    bookings.forEach(booking => {
      const { departure_time } = booking;
      let resource_id = this.calendar_data.resources.length + 1;
      this.calendar_data.resources.push({
        id: resource_id,
        booking_id: booking.id,
        title: "TBA",
        eventColor: booking.boat_class_color || "green",
        is_booking: true
      });
      const start_date = moment(booking.start_date);
      const end_date = moment(booking.end_date).add(1, "days");
      const duration = moment.duration(end_date.diff(start_date)).asDays();
      let booking_type = "";
      if (booking.booking_type == CONSTANT.bookingType.admin_use) {
        booking_type = " - Admin Use";
      }
      if (booking.booking_type == CONSTANT.bookingType.lesson_use) {
        booking_type = " - Lesson Use";
      }
      let title = `[${booking.status}${booking_type}] #${booking.id} - ${departure_time} - ${booking.user_surname}`;
      if (duration > 1) {
        title = `${title} - ${departure_time} - ${duration} days`;
      }
      const event = {
        resourceId: resource_id,
        booking_id: booking.id,
        start: start_date,
        end: end_date,
        title: title
      };
      this.calendar_data.events.push(event);
    });
  }

  buildCalendarEventsFromBoats(boats) {
    if (!boats || boats.length <= 0) return;
    boats.forEach(boat => {
      var eventColor = boat.event_color;
      let resource_id = this.calendar_data.resources.length + 1;
      this.calendar_data.resources.push({
        id: resource_id,
        boat_id: boat.id,
        title: boat.title,
        eventColor: eventColor
      });
      if (boat.events) {
        boat.events.forEach((event, index) => {
          let eventObj = {};
          const departure_time_s = event.departure_time_s ? `${event.departure_time_s} - ` : "";
          const start_date = moment(event.start_date);
          if (event.event_type == "block_out") {
            const end_date = moment(event.end_date).add(1, "days");
            eventObj = {
              color: "grey",
              resourceId: resource_id,
              start: start_date,
              end: end_date,
              title: event.title
            };
          } else if (event.event_type !== "yard") {
            const end_date = moment(event.end_date).add(1, "days");
            const duration = Math.round(moment.duration(end_date.diff(start_date)).asDays());
            let booking_type = "";
            if (event.booking_type == CONSTANT.bookingType.admin_use) {
              booking_type = " - Admin Use";
            }
            if (event.booking_type == CONSTANT.bookingType.lesson_use) {
              booking_type = " - Lesson Use";
            }
            let title = `[${event.status}${booking_type}] #${event.booking_id} - ${departure_time_s} ${
              event.user_surname
            }`;
            if (duration > 1) {
              title += ` - ${duration} days`;
            }
            eventObj = {
              booking_id: event.booking_id,
              resourceId: resource_id,
              start: start_date,
              end: end_date,
              title: title
            };
          } else {
            let { end_date } = event;
            let title = "Yard";
            if (end_date) {
              end_date = moment(event.end_date).add(1, "days");
              const duration = Math.round(moment.duration(end_date.diff(start_date)).asDays());
              if (duration > 1) {
                title = `${title} - ${departure_time_s} ${duration} days - Return on ${end_date.format(
                  CONSTANT.DATE_FORMAT_DISPLAY
                )}`;
              }
            } else {
              // yard_end_date not set
              // 60 days hard-coded to cover whole calendar
              end_date = moment(event.start).add(60, "days");
            }
            eventObj = {
              color: "grey",
              resourceId: resource_id,
              start: event.start_date,
              end: end_date,
              title: title
            };
          }
          this.calendar_data.events.push(eventObj);
        });
      }
    });
    this.initCalendar();
  }
}

class CustomDatePicker extends React.Component {
  render() {
    return (
      <span
        style={{
          color: "#007eff",
          padding: "0 5px",
          cursor: "pointer"
        }}
        onClick={this.props.onClick}
      >
        <Icon glyph="icon-simple-line-icons-calendar" />
      </span>
    );
  }
}
