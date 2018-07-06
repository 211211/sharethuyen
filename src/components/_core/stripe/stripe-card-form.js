import React from "react";
import { inject, observer } from "mobx-react";
import CardReactFormContainer from "card-react";
import _ from "lodash";
import { Row, Col, Form, FormGroup, Button, FormControl, Alert, Radio, ControlLabel } from "@sketchpixy/rubix";
import Loader from "react-loader";
import { URL_CONFIG } from "../../../common/config";
import client from "../../../common/http-client";
import BoatShareAddress from "../boat-share-address";
import StripeBadge from "./stripe-badge";
import UserBillingAddressForm from "../user-billing-address/user-billing-address-form";
import UserUtil from "../../user/user-util";

var ReactScriptLoaderMixin = require("react-script-loader").ReactScriptLoaderMixin;

/**
 * The ES6 extends way doesnot support mixins anymore
 */

var StripeCardForm = inject("store")(
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
          address_id: "",
          //'link' or 'add'
          billingMode: "link",
          billing_address: UserUtil.mapBillingAddressState({})
        };
      },

      getScriptURL: function() {
        return "https://js.stripe.com/v2/";
      },

      onScriptLoaded: function() {
        if (!StripeCardForm.getStripeToken) {
          // Put your publishable key here
          Stripe.setPublishableKey($("meta[name=stripe_publishable_key]").attr("content"));

          var newState = this.state;
          newState.stripeLoading = false;
          this.setState(newState);
        }
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
        if (this.userBillingAddressForm && !this.userBillingAddressForm.isValid()) {
          return;
        }
        var newState = this.state;
        newState.paymentError = null;
        newState.loaded = false;
        this.setState(newState);
        this.props.setSubmitDisable(true);
        let { billingMode } = this.state;
        const { user_side } = this.props;

        // send form here
        Stripe.createToken(event.target, (status, response) => {
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

            //Store card token together with billing address
            client
              .post(URL_CONFIG.create_card_path, {
                email: this.props.email,
                stripeToken: response.id,
                address_id: this.state.address_id,
                billingMode: billingMode,
                billing_address: this.state.billing_address
              })
              .then(
                res => {
                  if (res.user) {
                    this.props.store.updateUserBillingAddress(res.user.billing_addresses);
                  }
                  if (res.card_source) {
                    this.props.store.addPaymentCardSource(res.card_source);
                  }
                  this.props.closeModal();

                  if (billingMode == "link") {
                    this.props.store.fetchPayment();
                  } else {
                    //On user_side fetchPayment is enough
                    if (user_side) {
                      this.props.store.fetchPayment();
                    } else {
                      // Load user detail inorder to billing loaded
                      // This logic use in:
                      // 1. user-side Profile Page
                      // 2. admin-side User's edit page
                      if (_.isFunction(this.props.loadUserDetail)) {
                        this.props.loadUserDetail().then(() => {
                          this.props.store.fetchPayment();
                        });
                      } else {
                        this.props.store.fetchPayment();
                      }
                    }
                  }
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

      onChangeAddress: function(e) {
        var newState = this.state;
        newState.address_id = e.target.value;
        this.setState(newState);
      },

      switchBillingMode: function() {
        let { billingMode } = this.state;
        if (billingMode == "link") {
          this.setState({ billingMode: "add" });
        } else {
          this.setState({ billingMode: "link" });
        }
      },

      handleBillingAddressFieldChange: function(fieldName, value) {
        let { billing_address } = this.state;
        billing_address[fieldName] = value;
        this.setState({
          billing_address: billing_address
        });
      },

      render: function() {
        let { billingMode } = this.state;
        let { billing_address } = this.state;
        if (this.state.stripeLoading) {
          return <div>Loading</div>;
        } else if (this.state.stripeLoadingError) {
          return <div>Error</div>;
        } else {
          return (
            <div>
              <Loader loaded={this.state.loaded} />
              {(() => {
                if (this.state.paymentError && this.state.paymentError.length > 0) {
                  return (
                    <Alert danger dismissible>
                      {this.state.paymentError}
                    </Alert>
                  );
                }
              })()}
              <div id="card-wrapper" />
              <CardReactFormContainer container="card-wrapper" formatting={true}>
                <Form horizontal onSubmit={this.onSubmit} className={this.state.loaded ? "" : "is-loading"}>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Col md={4} componentClass={ControlLabel}>
                          Card Number
                        </Col>
                        <Col sm={7}>
                          <FormControl
                            type="text"
                            data-stripe="number"
                            name="number"
                            autoFocus
                            placeholder="Card Number"
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md={4} componentClass={ControlLabel}>
                          Name on Card
                        </Col>
                        <Col sm={7}>
                          <FormControl type="text" data-stripe="name" name="name" placeholder="Cardholder name" />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md={4} componentClass={ControlLabel}>
                          Expiration Date
                        </Col>
                        <Col sm={7}>
                          <FormControl type="text" data-stripe="exp" name="expiry" placeholder="MM/YYYY" />
                        </Col>
                      </FormGroup>
                      <FormGroup>
                        <Col md={4} componentClass={ControlLabel}>
                          CVC
                        </Col>
                        <Col sm={7}>
                          <FormControl type="number" data-stripe="cvc" placeholder="CVC" name="cvc" />
                        </Col>
                      </FormGroup>
                      <input type="submit" style={{ display: "none" }} ref={c => (this.submitButton = c)} />
                    </Col>
                  </Row>
                </Form>
              </CardReactFormContainer>
              <div>
                <label className="billing-address-title">Billing Address</label>
                {(() => {
                  if (billingMode == "link") {
                    return (
                      <div className="billing-address-content">
                        {this.props.addresses.map(address => {
                          return (
                            <Radio
                              defaultValue={address.id}
                              key={address.id}
                              onChange={this.onChangeAddress}
                              checked={this.state.address_id == address.id}
                              name="address-radio-options"
                            >
                              <BoatShareAddress address={address} />
                            </Radio>
                          );
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <UserBillingAddressForm
                        ref={c => (this.userBillingAddressForm = c)}
                        handleBillingAddressFieldChange={this.handleBillingAddressFieldChange}
                        billing_address={billing_address}
                      />
                    );
                  }
                })()}
                <Button outlined bsStyle="info" onClick={this.switchBillingMode}>
                  {(() => {
                    if (billingMode == "link") {
                      return "Add New";
                    } else {
                      return "Back to list";
                    }
                  })()}
                </Button>
                <FormGroup>
                  <Col sm={11} className="text-right">
                    <StripeBadge />
                  </Col>
                </FormGroup>
              </div>
            </div>
          );
        }
      }
    })
  )
);
module.exports = StripeCardForm;
