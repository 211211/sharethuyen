import React from "react";
import { inject, observer } from "mobx-react";

import { Row, Col, Form, FormGroup, Button, FormControl, Alert, Radio, ControlLabel } from "@sketchpixy/rubix";

import Loader from "react-loader";
import { URL_CONFIG } from "../../../common/config";
import BoatShareAddress from "../boat-share-address";
import StripeBadge from "./stripe-badge";

var ReactScriptLoaderMixin = require("react-script-loader").ReactScriptLoaderMixin;

/**
 * The ES6 extends way doesnot support mixins anymore
 */

var StripeBankAccountForm = inject("store")(
  observer(
    React.createClass({
      mixins: [ReactScriptLoaderMixin],

      getInitialState: function() {
        return {
          stripeLoading: true,
          stripeLoadingError: false,
          paymentError: null,
          cardAdded: false,
          token: null,
          errors: [],
          loaded: true,
          account: {
            country: "US",
            currency: "USD",
            routing_number: "",
            account_number: "",
            account_holder_name: "",
            account_holder_type: "individual"
          }
        };
      },

      getScriptURL: function() {
        return "https://js.stripe.com/v2/";
      },

      onScriptLoaded: function() {
        // Put your publishable key here
        Stripe.setPublishableKey($("meta[name=stripe_publishable_key]").attr("content"));

        var newState = this.state;
        newState.stripeLoading = false;
        this.setState(newState);
      },

      onScriptError: function() {
        var newState = this.state;
        newState.stripeLoading = false;
        newState.stripeLoadingError = true;
        this.setState(newState);
      },

      submitForm: function() {
        this.submitButton.click();
      },

      onSubmit: function(event) {
        event.preventDefault();
        var newState = this.state;
        newState.paymentError = null;
        newState.loaded = false;
        this.setState(newState);
        this.props.setSubmitDisable(true);

        // send form here
        Stripe.bankAccount.createToken(event.target, (status, response) => {
          if (response.error) {
            var newState = this.state;
            newState.paymentError = response.error.message;
            newState.loaded = true;
            this.setState(newState);
            this.props.setSubmitDisable(false);
          } else {
            var newState = this.state;
            newState.cardAdded = true;
            this.setState(newState);

            //Store card token
            $.post(URL_CONFIG.create_card_path, {
              email: this.props.email,
              stripeToken: response.id,
              address_id: this.state.address_id
            }).then(
              res => {
                if (res.user) {
                  this.props.store.updateUser(res.user);
                }
                if (res.card_source) {
                  this.props.store.addPaymentCardSource(res.card_source);
                }
                this.props.closeModal();
                this.props.setSubmitDisable(false);
              },
              res => {
                if (res.status == 400) {
                  if (res.responseJSON.hasOwnProperty("errors")) {
                    var newState = this.state;
                    newState.errors = res.responseJSON.errors;
                    newState.loaded = true;
                    this.setState(newState);
                    this.props.setSubmitDisable(false);
                  }
                } else {
                  var newState = this.state;
                  newState.loaded = true;
                  this.setState(newState);
                  this.props.setSubmitDisable(false);
                }
              }
            );
          }
        });
      },

      handleChangeCountry: function(e) {
        var newState = this.state;
        newState.account.country = e.target.value;
        this.setState(newState);
      },

      handleChangeCurrency: function(e) {
        var newState = this.state;
        newState.account.currency = e.target.value;
        this.setState(newState);
      },

      handleChangeRoutingNum: function(e) {
        var newState = this.state;
        newState.account.routing_number = e.target.value;
        this.setState(newState);
      },

      handleChangeAccountNum: function(e) {
        var newState = this.state;
        newState.account.account_number = e.target.value;
        this.setState(newState);
      },

      handleChangeAccountHolderName: function(e) {
        var newState = this.state;
        newState.account.account_holder_name = e.target.value;
        this.setState(newState);
      },

      handleChangeAccountHolderType: function(e) {
        var newState = this.state;
        newState.account.account_holder_type = e.target.value;
        this.setState(newState);
      },

      render: function() {
        if (this.state.stripeLoading) {
          return <div>Loading</div>;
        } else if (this.state.stripeLoadingError) {
          return <div>Error</div>;
        } else {
          var { errors } = this.state;
          let errorKeys = Object.keys(errors);
          errors = errorKeys.length ? (
            <Alert danger dismissible>
              {errorKeys.map((field, i) => {
                return (
                  <div key={i}>
                    <div>
                      <strong>{field}:</strong>
                    </div>
                    <ul>
                      {errors[field].map((error, j) => {
                        return <li key={j}>{error}</li>;
                      })}
                    </ul>
                  </div>
                );
              })}
            </Alert>
          ) : null;

          return (
            <div>
              <Loader loaded={this.state.loaded} />
              <Form horizontal onSubmit={this.onSubmit} className={this.state.loaded ? "" : "is-loading"}>
                <Row>
                  <Col md={12}>
                    {(() => {
                      if (this.state.paymentError && this.state.paymentError.length > 0) {
                        return (
                          <Alert danger dismissible>
                            {this.state.paymentError}
                          </Alert>
                        );
                      }
                    })()}
                    <Col md={12}>{errors}</Col>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Country
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          type="text"
                          data-stripe="country"
                          value={this.state.account.country}
                          onChange={this.handleChangeCountry}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Currency
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          type="text"
                          data-stripe="currency"
                          value={this.state.account.currency}
                          onChange={this.handleChangeCurrency}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Routing Number
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          type="text"
                          data-stripe="routing_number"
                          value={this.state.account.routing_number}
                          onChange={this.handleChangeRoutingNum}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Account Number
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          type="text"
                          data-stripe="account_number"
                          value={this.state.account.account_number}
                          onChange={this.handleChangeAccountNum}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Account Holder Name
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          type="text"
                          data-stripe="account_holder_name"
                          value={this.state.account.account_holder_name}
                          onChange={this.handleChangeAccountHolderName}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={4} componentClass={ControlLabel}>
                        Account Holder Type
                      </Col>
                      <Col sm={7}>
                        <FormControl
                          componentClass="select"
                          data-stripe="account_holder_type"
                          value={this.state.account.account_holder_type}
                          onChange={this.handleChangeAccountHolderType}
                        >
                          <option value="individual">Individual</option>
                          <option value="company">Company</option>
                        </FormControl>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col sm={11} className="text-right">
                        <StripeBadge />
                      </Col>
                    </FormGroup>
                    <input type="submit" style={{ display: "none" }} ref={c => (this.submitButton = c)} />
                  </Col>
                </Row>
              </Form>
            </div>
          );
        }
      }
    })
  )
);
module.exports = StripeBankAccountForm;
