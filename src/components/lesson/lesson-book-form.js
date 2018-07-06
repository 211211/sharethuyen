import React from "react";
import { inject, observer } from "mobx-react";
import DatePicker from "react-datepicker";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  FormControl,
  ControlLabel
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../common/config";
import client from "../../common/http-client";
import SelectUserFormGroup from "../_core/select-user-form-group";
import SelectLessonFormGroup from "../_core/select-lession-form-group";
import BookingPaymentMethod from "../_core/booking/booking-payment-method";
import AppUtil from "../../common/util";

@inject("store")
@observer
export default class LessonBookForm extends React.Component {
  constructor(props) {
    super(props);

    //Init state, should avoid null data type
    this.state = {
      booking: {
        lesson: "",
        user: props.current_user ? props.current_user : "",
        amount: 0,
        discount_percent: "",
        discount_amount: "",
        amount_after_discounted: 0,
        amount_of_tax: 0,
        amount_after_tax: 0,
        date: undefined
      },
      settings: {
        lesson_charge_sale_tax: false,
        lesson_discount_percent: 0,
        sale_tax_percent: 0
      },
      submitDisabled: false
    };
  }

  componentDidMount() {
    client.get(`${URL_CONFIG.user_settings_path}`).then(res => {
      let newState = this.state;
      newState.settings.lesson_charge_sale_tax = res.lesson_charge_sale_tax ? res.lesson_charge_sale_tax : false;
      newState.settings.lesson_discount_percent = res.lesson_discount_percent
        ? parseFloat(res.lesson_discount_percent)
        : 0;
      newState.settings.sale_tax_percent = res.sale_tax_percent ? parseFloat(res.sale_tax_percent) : 0;
      this.setState(newState);
    });
  }

  updateBooking(booking) {
    let newState = this.state;
    let newBooking = $.extend(newState.booking, booking);

    this.calculateAndUpdateBookingAmount(newBooking);
  }

  calculateAndUpdateBookingAmount(booking) {
    let bookingAmount = booking.amount;

    if (booking.discount_percent && booking.discount_percent > 0 && booking.discount_percent <= 100) {
      booking.amount_after_discounted = booking.amount - (booking.amount * booking.discount_percent) / 100;
      booking.discount_amount = booking.amount - booking.amount_after_discounted;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
    } else {
      booking.amount_after_discounted = bookingAmount;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
      booking.discount_percent = "";
      booking.discount_amount = "";
    }

    this.setState({
      booking: booking
    });
  }

  setSubmitDisable(value) {
    var newState = this.state;
    newState.submitDisabled = value;
    this.setState(newState);
  }

  //TODO: This is quick and dirty way to expose internal state for parent component
  getBooking() {
    let booking = this.state.booking;
    booking.payment_methods = this.paymentMethods.wrappedInstance.getPaymentMethods();
    return booking;
  }

  handleChangeDiscountPercent(discountPercent) {
    let booking = this.state.booking;
    if (discountPercent < 0) {
      booking.discount_percent = 0;
    } else if (discountPercent > 100) {
      booking.discount_percent = 100;
    } else {
      booking.discount_percent = discountPercent;
    }

    if (booking.discount_percent && booking.discount_percent > 0 && booking.discount_percent <= 100) {
      booking.amount_after_discounted = booking.amount - (booking.amount * booking.discount_percent) / 100;
      booking.discount_amount = booking.amount - booking.amount_after_discounted;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
    } else {
      booking.amount_after_discounted = booking.amount;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
      booking.discount_amount = "";
    }

    this.setState({
      booking: booking
    });
  }

  handleChangeDiscountAmount(e) {
    let booking = this.state.booking;
    booking.discount_amount = e.target.value;

    if (e.target.value < 0) {
      booking.discount_amount = 0;
    } else if (e.target.value > booking.amount) {
      booking.discount_amount = booking.amount;
    } else {
      booking.discount_amount = e.target.value;
    }

    if (booking.discount_amount && booking.discount_amount <= booking.amount) {
      booking.amount_after_discounted = booking.amount - booking.discount_amount;
      booking.discount_percent = (booking.discount_amount / booking.amount) * 100;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
    } else {
      booking.amount_after_discounted = booking.amount;
      booking.amount_of_tax = (booking.amount_after_discounted * this.state.settings.sale_tax_percent) / 100;
      booking.amount_after_tax = booking.amount_after_discounted + booking.amount_of_tax;
      booking.discount_percent = "";
    }

    this.setState({
      booking: booking
    });
  }

  onChangeUser(user) {
    let newState = this.state;
    newState.booking.user = user;
    if (
      user &&
      user.membership_status == CONSTANT.MEMBERSHIP_STATUS.PAID &&
      newState.settings.lesson_discount_percent
    ) {
      newState.booking.discount_percent = newState.settings.lesson_discount_percent;
      this.calculateAndUpdateBookingAmount(newState.booking);
      this.handleChangeDiscountPercent(newState.booking.discount_percent);
    } else {
      newState.booking.discount_percent = 0;
    }
    this.updateBooking(newState.booking);
  }

  onChangeLesson(lesson) {
    let newState = this.state;
    newState.booking.lesson = lesson;
    newState.booking.amount = lesson.price;
    this.setState(newState);

    this.updateBooking(newState.booking);
  }

  notDayInPast(day) {
    return day >= moment();
  }

  handleChangeDate(val) {
    let newState = this.state;
    newState.booking.date = val;
    this.setState(newState);
  }

  valid() {
    if (!this.state.booking.user) {
      AppUtil.growlError("You need to select an user to book for");
      return false;
    } else if (!this.state.booking.lesson) {
      AppUtil.growlError("You need to select a lesson to book");
      return false;
    } else if (!this.state.booking.date) {
      AppUtil.growlError("You need to select a date");
      return false;
    }

    return this.paymentMethods.wrappedInstance.valid();
  }

  bookALesson() {
    if (this.valid()) {
      this.setState({
        submitDisabled: true
      });

      client
        .post(`${URL_CONFIG.lessons_path}/book`, {
          lesson: {
            id: this.state.booking.lesson.id,
            user_id: this.state.booking.user.id,
            date: this.state.booking.date.format(CONSTANT.DATE_FORMAT),
            payment_methods: this.paymentMethods.wrappedInstance.getPaymentMethods(),
            discount_percent: this.state.booking.discount_percent || 0
          }
        })
        .then(
          res => {
            this.setState({
              submitDisabled: false
            });

            if (res.result == "success") {
              this.setState({
                success: true
              });
            } else {
              Util.growlError("something_wrong");
            }
            this.props.router.push(`${URL_CONFIG.lessons_path}`);
            this.props.store.cleanPayment();
            AppUtil.growl("The lesson booking has been created successfully!");
          },
          response => {
            AppUtil.growlError("something_wrong");

            this.setState({
              submitDisabled: false
            });
          }
        );
    }
  }

  backToLessonIndex() {
    this.props.router.push(`${URL_CONFIG.lessons_path}`);
  }

  render() {
    let { user } = this.state.booking;

    return (
      <PanelContainer noOverflow>
        <Panel>
          <PanelBody>
            <Grid>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Add Lesson Booking</h4>
                </Col>
              </Row>
              <Row>
                <Col md={8} mdPush={2}>
                  <Form horizontal>
                    <SelectUserFormGroup
                      user={user}
                      onChangeUser={::this.onChangeUser}
                      ref={c => (this.selectUser = c)}
                    />
                    <SelectLessonFormGroup
                      lesson={this.state.booking.lesson}
                      onChangeLesson={::this.onChangeLesson}
                      ref={c => (this.selectLesson = c)}
                    />
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Preferred Date <span className="req-field">*</span>
                      </Col>
                      <Col sm={6} className={this.state.isError ? "error" : ""}>
                        <DatePicker
                          selected={this.state.booking.date}
                          filterDate={this.notDayInPast}
                          onChange={val => {
                            this.handleChangeDate(val);
                          }}
                          placeholderText="Click to select a date"
                        />
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Discount</h4>
                </Col>
                <Col md={6} mdOffset={3}>
                  <Form horizontal>
                    <FormGroup>
                      <Col sm={3} />
                      <Col sm={9}>
                        Discount percent will be pulled automatically from Settings for Paid membership charge users
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Discount Percent
                      </Col>
                      <Col sm={9}>
                        <FormControl
                          type="number"
                          min={0}
                          max={99}
                          value={this.state.booking.discount_percent}
                          onChange={e => {
                            this.handleChangeDiscountPercent(e.target.value);
                          }}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={3} componentClass={ControlLabel}>
                        Discount Amount
                      </Col>
                      <Col sm={9}>
                        <FormControl
                          type="number"
                          min={0}
                          max={this.state.booking.amount}
                          value={this.state.booking.discount_amount}
                          onChange={::this.handleChangeDiscountAmount}
                        />
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Payment Detail</h4>
                </Col>
                <Col md={6} mdPush={3}>
                  <Form horizontal className="booking-detail">
                    <FormGroup controlId="staticControl">
                      <Col sm={3} componentClass={ControlLabel}>
                        Subtotal
                      </Col>
                      <Col sm={9}>
                        <FormControl.Static>
                          {AppUtil.currencyFormatter().format(this.state.booking.amount_after_discounted)}
                        </FormControl.Static>
                      </Col>
                    </FormGroup>
                    <FormGroup controlId="staticControl">
                      <Col sm={3} componentClass={ControlLabel}>
                        WA Sales Tax
                      </Col>
                      <Col sm={9}>
                        <FormControl.Static>
                          {AppUtil.currencyFormatter().format(this.state.booking.amount_of_tax)}
                        </FormControl.Static>
                      </Col>
                    </FormGroup>
                    <FormGroup controlId="staticControl">
                      <Col sm={3} componentClass={ControlLabel}>
                        Total
                      </Col>
                      <Col sm={9}>
                        <FormControl.Static>
                          {AppUtil.currencyFormatter().format(this.state.booking.amount_after_tax)}
                        </FormControl.Static>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h4 className="section-form-title">Payment Methods</h4>
                </Col>
                <Col md={6} mdPush={3}>
                  <BookingPaymentMethod
                    season_configuration={this.state.season_configuration}
                    amount={this.state.booking.amount_after_tax}
                    user={this.state.booking.user}
                    ref={c => (this.paymentMethods = c)}
                  />
                </Col>
              </Row>
              <Row className="text-right">
                <Col md={12}>
                  <div className="text-right">
                    <small>
                      <i>* Click to make payment and confirm your booking</i>
                    </small>
                  </div>
                  <div>
                    <Button outlined bsStyle="default" onClick={::this.backToLessonIndex}>
                      Cancel
                    </Button>{" "}
                    <Button
                      outlined
                      bsStyle="primary"
                      onClick={::this.bookALesson}
                      disabled={this.state.submitDisabled}
                    >
                      PAY & CONFIRM BOOKING
                    </Button>
                  </div>
                  <br />
                </Col>
              </Row>
            </Grid>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
