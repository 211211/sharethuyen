import React from "react";
import { inject, observer } from "mobx-react";

import DatePicker from "react-datepicker";

import {
  PanelContainer,
  Panel,
  PanelBody,
  Grid,
  Row,
  Col,
  Image,
  Button,
  Modal,
  ControlLabel,
  Form,
  FormGroup,
  FormControl
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import UserSideHeader from "../_core/user-side-header.js";
import BookingPaymentMethod from "../../_core/booking/booking-payment-method";
import Util from "../../../common/util";

import { withRouter, Link } from "react-router";

@withRouter
@inject("store")
@observer
export default class UserSideDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lesson: { id: "", name: "", description: "", price: "" },
      date: null,
      submitDisabled: false,
      success: false
    };
  }

  componentDidMount() {
    let { id } = this.props.params;

    client.get(`${URL_CONFIG.user_lessons_path}/${id}`).then(res => {
      this.setState({
        lesson: res
      });
    });
  }

  handleChangeDate(val) {
    this.setState({
      date: val
    });
  }

  valid() {
    if (!this.state.date) {
      Util.growlError("need_to_select_date");
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
        .post(`${URL_CONFIG.user_lessons_path}/${this.state.lesson.id}/book`, {
          lesson: {
            date: this.state.date.format(CONSTANT.DATE_FORMAT),
            payment_methods: this.paymentMethods.wrappedInstance.getPaymentMethods()
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
              if (res.user) {
                this.props.store.updateUserBalance(res.user.balance);
              }
              this.props.store.cleanPayment();
            } else {
              Util.growlError("something_wrong");
            }
            // this.props.router.push(`${URL_CONFIG.user_bookings_path}/${id}`);
          },
          response => {
            this.setState({
              submitDisabled: false
            });

            if (response.status == 400) {
              if (response.responseJSON.hasOwnProperty("errors")) {
                $(document).trigger("ei:showAlert", [response.responseJSON]);
              } else if (response.responseJSON.hasOwnProperty("error")) {
                $(document).trigger("ei:showAlert", [response.responseJSON.error]);
              }
            }
          }
        );
    }
  }

  notDayInPast(day) {
    return day >= moment();
  }

  backToDashboard() {
    this.props.router.push(`${URL_CONFIG.dashboard_path}`);
  }

  render() {
    const user = this.props.store.user;
    let price = this.state.lesson.price || 0;
    let sale_tax_percent = 0;
    let lesson_charge_sale_tax = this.props.store.settings ? this.props.store.settings.lesson_charge_sale_tax : false;

    if (lesson_charge_sale_tax) {
      sale_tax_percent = this.props.store.settings ? this.props.store.settings.sale_tax_percent : 0;
      sale_tax_percent = parseFloat(sale_tax_percent);
    }
    let amount_of_tax = (price * sale_tax_percent) / 100;
    let price_after_tax = price + amount_of_tax;

    return (
      <div className="user-side">
        <UserSideHeader />
        <PanelContainer noOverflow controls={false}>
          <Panel>
            <PanelBody>
              <Grid>
                <Row>
                  <Col xs={12} className="text-center section-header">
                    <h2 className="bshare-primary-color page-title">{this.state.lesson.name}</h2>
                    <p>{this.state.lesson.description}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Preferred Date</h4>
                  </Col>
                  <Col md={6} mdOffset={3}>
                    <DatePicker
                      selected={this.state.date}
                      filterDate={this.notDayInPast}
                      onChange={val => {
                        this.handleChangeDate(val);
                      }}
                      placeholderText="Click to select a date"
                    />
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
                          <FormControl.Static>{Util.currencyFormatter().format(price)}</FormControl.Static>
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="staticControl">
                        <Col sm={3} componentClass={ControlLabel}>
                          WA Sales Tax
                        </Col>
                        <Col sm={9}>
                          <FormControl.Static>{Util.currencyFormatter().format(amount_of_tax)}</FormControl.Static>
                        </Col>
                      </FormGroup>
                      <FormGroup controlId="staticControl">
                        <Col sm={3} componentClass={ControlLabel}>
                          Total
                        </Col>
                        <Col sm={9}>
                          <FormControl.Static>{Util.currencyFormatter().format(price_after_tax)}</FormControl.Static>
                        </Col>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <h4 className="section-form-title">Payment Method</h4>
                  </Col>
                  <Col md={6} mdOffset={3}>
                    <BookingPaymentMethod
                      user_side={true}
                      amount={price_after_tax}
                      user={user}
                      ref={c => (this.paymentMethods = c)}
                    />
                  </Col>
                </Row>
                <Row className="text-right">
                  <Col md={12}>
                    <br />
                    <div>
                      <Button outlined bsStyle="default">
                        Cancel
                      </Button>{" "}
                      <Button
                        outlined
                        bsStyle="primary"
                        onClick={::this.bookALesson}
                        disabled={this.state.submitDisabled}
                      >
                        Book now
                      </Button>
                    </div>
                    <br />
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
        <Modal show={this.state.success} keyboard={false} enforceFocus={true} backdrop="static">
          <Modal.Body>
            We have received your booking of lesson <b>{this.state.lesson.name}</b> on{" "}
            <b>{this.state.date ? this.state.date.format(CONSTANT.DATE_FORMAT_DISPLAY) : ""}</b>. We will contact you
            shortly
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="default" onClick={::this.backToDashboard}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
