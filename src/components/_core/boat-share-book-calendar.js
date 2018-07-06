import React from "react";
import ReactDOM from "react-dom";
import Loader from "react-loader";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { isNil } from "lodash/lang";
import { isNumber, isObject, isString } from "lodash";
import { Radio, Media } from "@sketchpixy/rubix";
import { URL_CONFIG, CONSTANT, IMAGES } from "../../common/config";
import client from "../../common/http-client";
import util from "../../common/util";
import BookingUtil from "../../common/booking-util";
import CellWaitlist from "./bs-book-calendar/cell-waitlist";

@inject("store", "newBookingStore")
@observer
export default class BoatShareBookCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  @computed
  get booking() {
    return this.props.newBookingStore;
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  componentDidMount() {
    this.initCalendarDummyData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.booking_settings_loaded) {
      this.setState({
        loaded: true
      });
    }
  }

  initCalendarDummyData() {
    this.calendar_data = {
      booking_data: {}
    };
    this.initCalendar();
  }

  requestBookingData(user_id, boat_class_id, date, needReset = true) {
    if (isNil(user_id) || isNil(date)) {
      return;
    }
    const booking_id = this.booking.id;
    this.boat_class_id = boat_class_id;
    this.user_id = user_id;
    this.month = moment(date).month();
    this.date = date;
    this.setState({ loaded: false });

    client
      .get(`${URL_CONFIG.user_bookings_booking_data_in_month_path}`, {
        user_id: user_id,
        boat_class_id: boat_class_id || undefined,
        booking_id: booking_id,
        date: date
      })
      .then(
        res => {
          this.calendar_data.booking_data = res.booking_data;
          this.calendar_data.boat_class = res.boat_class;
          this.initCalendar();

          // Change request from choosing alternative boat class,
          // We already make sure choosen date is valid, then keep the old selected dates
          const notAlternativeBoatClass =
            this.booking.boatClassChangedMode != CONSTANT.boatClassChangedMode.alternativeBoatClass;

          if (needReset && notAlternativeBoatClass) {
            this.booking.start_date = "";
            this.booking.end_date = "";
            this.booking.clearAmountDetail();
          } else {
            // start_date and end_date used to hightlight the date in calendar
            // currently, used in booking edit, convert waitlist to booking
            this.highlightDatesOfBooking();
          }

          if (this.booking.waitlist_to_booking) {
            const date = this.booking.start_date;
            const { booking_data } = this.calendar_data;
            const date_data = booking_data[date.format(CONSTANT.DATE_FORMAT)];
            if (date_data && date_data.price) {
              this.addNewAmountDetail(date, date_data.price);
            }
          }

          // Reset boat class change mode
          this.booking.boatClassChangedMode = "";
          this.setState({ loaded: true });
        },
        () => {
          this.setState({ loaded: true });
          util.growlError("Cannot load booking data in month!");
        }
      );
  }

  highlightDatesOfBooking() {
    const { end_date } = this.booking;
    let from_date = this.booking.start_date.clone();
    while (from_date <= end_date) {
      this.highlightDate(from_date);
      from_date.add(1, "day");
    }
  }

  initCalendar() {
    if (this.calendar) {
      this.calendar.fullCalendar("destroy");
    }
    this.setState({ loaded: false });

    let { props, booking } = this;
    let { calendar_data } = this;
    const { user, booking_settings } = props;
    let isMidWeekUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.mid_week;
    const highlightDate = this.highlightDate.bind(this);
    const addNewAmountDetail = this.addNewAmountDetail.bind(this);

    let start, end;
    let selectedDates = [];
    this.calendar = $("#calendar").fullCalendar({
      header: {
        left: "prev,next today",
        center: "title",
        right: "month"
      },
      height: "auto",
      contentHeight: "auto",
      defaultDate: this.date,
      selectable: true,
      selectHelper: true,
      unselectAuto: false,
      dayClick: (dateFullCalendar, jsEvent, view) => {
        // Need convert full calendar date to America/Los_Angeles timezone
        const date = moment(dateFullCalendar.format("YYYY-MM-DD"));
        let { booking_data, boat_class } = this.calendar_data;
        const date_booking_data = booking_data[date.format(CONSTANT.DATE_FORMAT)];

        if (moment().diff(date, "days") > 0) {
          return;
        }
        if (isMidWeekUser) {
          if (
            date
              .clone()
              .startOf("week")
              .diff(date, "days") === 0 ||
            date
              .clone()
              .endOf("week")
              .diff(date, "days") === 0
          ) {
            return;
          }
        }

        let season_start_date = moment(this.settings.season_start_date);
        let season_end_date = moment(this.settings.season_end_date);
        const dateAvailable = isString(date_booking_data.availability) && date_booking_data.availability !== "no";
        const dateNotAvailable =
          date_booking_data.availability === "no" &&
          isNumber(date_booking_data.num_of_bookings) &&
          date_booking_data.num_of_bookings == 0;

        if (
          moment(date).isAfter(season_end_date) ||
          moment(date).isBefore(season_start_date) ||
          isNil(date_booking_data) ||
          dateNotAvailable
        ) {
          resetCalendar();
          return;
        }

        const { booking_settings, user_side } = props;

        if (this.props.user_side) {
          if (this.isReserveHourInvalid(booking_settings, date)) {
            const msg = this.getMessageForReserveHour(booking_settings.booking_reserve_hours);
            util.growlError(msg, "Opps!");
            return;
          } else if (BookingUtil.isBlockoutDate(booking_settings, date, boat_class)) {
            util.growlError(
              `Please call ${this.settings.homebase_phone} to make a booking. This date has been blocked by admin.`,
              "Opps!"
            );
            return;
          } else {
            const result = BookingUtil.isBookingMissDeadline(booking_settings, date);
            if (result.isBlock) {
              util.growlError(
                `Please call ${
                  this.settings.homebase_phone
                } to make a booking. If you wish to book for this date please reserve before ${result.deadline_date}.`,
                "Opps!"
              );
              return;
            }
          }
        }

        if (dateAvailable) {
          handleDateAvailable();
        }

        function handleDateAvailable() {
          if (typeof start === "undefined") {
            initStartDate(date);
          } else {
            let lastSelectedDate = selectedDates[selectedDates.length - 1];
            if (date.isSame(lastSelectedDate.clone().add(1, "days"))) {
              end = date;
              selectedDates.push(date);
              highlightDate(date);
              booking.start_date = start;
              booking.end_date = end;
              addNewAmountDetail(date, booking_data[date.format(CONSTANT.DATE_FORMAT)].price);
              checkHalfDayAndCreateSystemNotes(end);
            } else {
              initStartDate(date);
            }
          }

          const dateBefore = date
            .clone()
            .subtract(1, "day")
            .format(CONSTANT.DATE_FORMAT);
          const booking_date_before_data = booking_data[dateBefore];
          const previousDateIsHalfDate =
            booking_data[dateBefore] && booking_data[dateBefore].availability === "half_day";
          if (typeof start !== "undefined" && previousDateIsHalfDate) {
            initStartDate(date);
            return;
          }
          booking.loadBoatClassPrices();
        }

        function resetCalendar() {
          booking.start_date = "";
          booking.end_date = "";
          booking.clearAmountDetail();
          booking.system_notes = "";
          $("#calendar")
            .find(".fc-day.highlight")
            .removeClass("highlight");
          selectedDates = [];
          start = undefined;
        }

        function initStartDate(date) {
          $("#calendar")
            .find(".fc-day.highlight")
            .removeClass("highlight");
          start = date;
          highlightDate(start);
          booking.start_date = start;
          booking.end_date = start;
          booking.clearAmountDetail();
          addNewAmountDetail(date, booking_data[date.format(CONSTANT.DATE_FORMAT)].price);
          checkHalfDayAndCreateSystemNotes(start);
          selectedDates = [date];
        }

        function checkHalfDayAndCreateSystemNotes(date) {
          const date_booking_data = booking_data[date.format(CONSTANT.DATE_FORMAT)];
          if (date_booking_data.availability === "half_day") {
            const return_before = moment()
              .startOf("day")
              .add(date_booking_data.return_before, "minutes")
              .format("hh:mma");
            booking.system_notes = `Please return the boat before ${return_before} for next booking.`;
            booking.return_before = date_booking_data.return_before;
          } else {
            booking.system_notes = "";
            booking.return_before = "";
          }
        }
      },
      editable: true,
      dayRender: this.dayRender.bind(this),
      viewRender: (view, element) => {
        //Normally, the view will hold more than one month.
        //We plus +10 day to the start date of the view, to get the correct day
        let day = view.dayGrid.start.clone().add(10, "day");
        if (this.month !== day.month()) {
          this.requestBookingData(this.user_id, this.boat_class_id, day.format(CONSTANT.DATE_FORMAT));
        }
      }
    });
  }

  addNewAmountDetail(date, price) {
    const { start_date_was, end_date_was, mode } = this.booking;
    if (mode === "edit" && start_date_was <= date && date <= end_date_was) {
      // In edit mode, do not caculate if booking on the old dates
      return;
    }
    this.booking.addNewAmountDetail(date.format(CONSTANT.DATE_FORMAT), price);
  }

  highlightDate(date) {
    $("#calendar")
      .find('.fc-day[data-date="' + date.format(CONSTANT.DATE_FORMAT) + '"]')
      .addClass("highlight");
  }

  valid() {
    const { start_date, end_date, start_date_was, end_date_was, mode } = this.booking;
    if (!start_date || !end_date) {
      util.growlError("need_to_select_booking_days_before_creating_booking");
      return false;
    }
    if (mode == "edit" && start_date.isSame(start_date_was) && end_date.isSame(end_date_was)) {
      util.growlError("need_to_select_booking_days_before_creating_booking");
      return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        <Loader loaded={this.state.loaded} />
        <div className={this.state.loaded ? "" : "is-loading"}>
          <div id="calendar" className="bs-booking-calendar" />
        </div>
      </div>
    );
  }

  dayRender(dateFullCalendar, cell) {
    // Need convert full calendar date to America/Los_Angeles timezone
    const date = moment(dateFullCalendar.format("YYYY-MM-DD"));
    const { props, calendar_data, settings, user_id, boat_class_id } = this;
    const { user, booking_settings, user_side } = props;
    const isMidWeekUser = user.membership_type === CONSTANT.MEMBERSHIP_TYPE.mid_week;

    const season_start_date = moment(settings.season_start_date);
    const season_end_date = moment(settings.season_end_date);
    const { booking_data, boat_class } = calendar_data;
    const date_booking_data = booking_data[date.format(CONSTANT.DATE_FORMAT)];

    function disableCell() {
      $(cell).addClass("disabled");
      $(cell).html(`<span class="cell-content">N/A</span>`);
    }

    // Not in season
    if (date.isAfter(season_end_date) || date.isBefore(season_start_date) || moment().diff(date, "days") > 0) {
      disableCell();
      return;
    }
    if (isMidWeekUser) {
      if (
        date
          .clone()
          .startOf("week")
          .diff(date, "days") === 0 ||
        date
          .clone()
          .endOf("week")
          .diff(date, "days") === 0
      ) {
        disableCell();
        return;
      }
    }

    if (isNil(date_booking_data) || date_booking_data.availability === "no") {
      if (
        isObject(date_booking_data) &&
        isNumber(date_booking_data.num_of_bookings) &&
        date_booking_data.num_of_bookings > 0
      ) {
        ReactDOM.render(
          <CellWaitlist user_side={user_side} date={date} boat_class_id={boat_class_id} user_id={user_id} />,
          cell[0]
        );
      } else {
        disableCell();
      }
    } else {
      const boat_class_color = (boat_class && boat_class.color_hex) || CONSTANT.BOAT_CLASS.default_color;
      const logo_boat = util.getBoatLogo(boat_class_color);
      const cell_html = boat_class
        ? `<span class="cell-content">
            $${date_booking_data.price} ${logo_boat}
            <span class="actions-wrap"></span>
          </span>`
        : `<span class="cell-content">
            ${logo_boat}
            <span class="actions-wrap"></span>
          </span>`;
      $(cell).html(cell_html);
      if (this.isReserveHourInvalid(booking_settings, date)) {
        const msg = this.getMessageForReserveHour(booking_settings.booking_reserve_hours);
        this.renderBlockedCell(cell, msg);
      } else if (BookingUtil.isBlockoutDate(booking_settings, date, boat_class)) {
        const msg = `Please call ${
          this.settings.homebase_phone
        } to make a booking. This date has been blocked by admin.`;
        this.renderBlockedCell(cell, msg);
      } else {
        const result = BookingUtil.isBookingMissDeadline(booking_settings, date);
        if (result.isBlock) {
          const msg = `Please call ${
            this.settings.homebase_phone
          } to make a booking. If you wish to book for this date please reserve before ${result.deadline_date}.`;
          this.renderBlockedCell(cell, msg);
        }
      }
      if (date_booking_data.availability === "half_day") {
        $(cell)
          .find(".actions-wrap")
          .append(`<span class="icon-fontello-warning-1 rubix-icon bs-icon-need-return-early"></span>`);
        const iconReturn = cell.find(".bs-icon-need-return-early");
        const return_before = moment()
          .startOf("day")
          .add(date_booking_data.return_before, "minutes")
          .format("hh:mma");
        const msg = `If you wish to book for this date please return the boat before ${return_before} for next booking.`;
        this.initTooltip(iconReturn, msg);
      }
    }
  }

  renderBlockedCell(cell, msg) {
    $(cell)
      .find(".cell-content")
      .addClass("cell-blocked");
    $(cell)
      .find(".actions-wrap")
      .append(`<span class="icon-fontello-block-3 rubix-icon bs-icon-block"></span>`);
    const iconBlock = cell.find(".bs-icon-block");
    this.initTooltip(iconBlock, msg);
  }

  isReserveHourInvalid(booking_settings, date) {
    let isReserveHourInvalid = false;
    const { booking_reserve_hours } = booking_settings;
    if (booking_reserve_hours === 0) {
      // 0 used as a flag to turn off reserve hour rule
      return false;
    }
    if (!isNil(booking_reserve_hours)) {
      const booking_start_date = date.clone();
      let deltaHour = 0;
      if (booking_reserve_hours > 0) {
        deltaHour = CONSTANT.cutOffTime;
      } else {
        deltaHour = CONSTANT.cutOffTime + Math.abs(booking_reserve_hours);
      }
      const booking_time_before = booking_start_date
        .clone()
        .add(deltaHour, "hour")
        .subtract(Math.max(booking_reserve_hours, 0), "hour");
      if (booking_time_before < moment()) {
        isReserveHourInvalid = true;
      }
    }
    return isReserveHourInvalid;
  }

  initTooltip(elem, message) {
    $(elem).mouseover(function(e) {
      var tooltip = '<div class="bs-tooltipevent">' + message + "</div>";
      var $tooltip = $(tooltip).appendTo("body");
      $(elem)
        .mouseover(function(e) {
          $(elem).css("z-index", 10000);
          $tooltip.fadeIn("500");
          $tooltip.fadeTo("10", 1.9);
        })
        .mousemove(function(e) {
          $tooltip.css("top", e.pageY + 10);
          $tooltip.css("left", e.pageX + 20);
        });
    });
    $(elem).mouseout(e => {
      $(elem).css("z-index", 8);
      $(".bs-tooltipevent").remove();
    });
  }

  formatHour(hour) {
    if (hour == 12) {
      return "12pm";
    } else if (hour > 12) {
      return hour - 12 + "pm";
    } else {
      return hour + "am";
    }
  }

  getMessageForReserveHour(booking_reserve_hours) {
    if (booking_reserve_hours > 0) {
      return `Please call ${
        this.settings.homebase_phone
      } to make a booking. Bookings need to be made ${booking_reserve_hours}hrs before the ${
        CONSTANT.cutOffTime
      }am cut off time.`;
    } else {
      const cutOffTime = this.formatHour(CONSTANT.cutOffTime + Math.abs(booking_reserve_hours));
      return `Please call ${
        this.settings.homebase_phone
      } to make a booking. Bookings need to be made before ${cutOffTime}.`;
    }
  }
}
