import React from "react";
import ReactDOM from "react-dom";
import reactCSS from "reactcss";
import { inject } from "mobx-react";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  Alert,
  Button,
  PanelContainer,
  Panel,
  PanelBody,
  PanelHeader,
  PanelFooter,
  FormControl,
  Label,
  Icon,
  ControlLabel
} from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import ModalConfirm from "../modal-confirm";
import BoatShareAddress from "../boat-share-address";
import StripeMicrodepositModal from "../stripe/stripe-microdeposit-modal";
import CardLinkAddressModal from "./card-link-address-modal";
import UserPaymentCard from "./user-payment-card";
import UserPaymentBankAccount from "./user-payment-bank-account";

@inject("store")
export default class UserPaymentSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {}
    };
    this.state.address = this.getAddress(props) || {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.card.metadata && nextProps.card.metadata.address_id > 0) {
      var newState = this.state;
      newState.address = this.getAddress(nextProps) || {};
      this.setState(newState);
    }
  }

  getAddress(props, address_id_param) {
    var address_id;
    if (address_id_param) {
      address_id = address_id_param;
    } else {
      if (props.card.metadata && props.card.metadata.address_id > 0) {
        address_id = props.card.metadata.address_id;
      }
    }
    if (address_id) {
      var newState = this.state;
      let foundAddress = props.addresses.filter(function(billing_address) {
        return address_id == billing_address.id;
      })[0];
      if (!foundAddress) {
        console.warn("Cannot found associated address. Maybe it was removed, considered as `Unlink`");
      }
      return foundAddress;
    }
  }

  onClickRemove() {
    this.confirmDeleteModal.open();
  }

  linkAddress() {
    this.linkAddressModal.open();
  }

  onClickVerify() {
    this.stripeMicrodepositModal.open();
  }

  linkAddressResolved(address_id, billing_mode, billing_address) {
    if (address_id || billing_mode == "add") {
      this.linkAddressModal.setLoading(true);
      client
        .post(`${URL_CONFIG.update_card_meta}`, {
          email: this.props.email,
          stripeToken: this.props.card.id,
          address_id: address_id,
          mode: billing_mode,
          billing_address: billing_address
        })
        .then(res => {
          this.linkAddressModal.setLoading(false);
          if (billing_mode == "link") {
            var newState = this.state;

            //Update metadata to get UI synced
            newState.address = this.getAddress(this.props, address_id) || {};
            this.setState(newState);
          } else {
            //On user_side fetchPayment is enough
            if (this.props.user_side) {
              this.props.store.updateUser(res.user);
              this.props.store.fetchPayment();
            } else {
              this.props.loadUserDetail().then(() => {
                this.props.store.fetchPayment();
              });
            }
          }
          this.linkAddressModal.close();
        });
    } else {
      //User might not select any billing address
      this.linkAddressModal.close();
    }
  }

  stripeMicrodepositResolved(firstDeposit, secondDeposit) {
    this.stripeMicrodepositModal.setLoading(true);
    client
      .post(`${URL_CONFIG.microdeposit_path}`, {
        email: this.props.email,
        bank_account_id: this.props.card.id,
        first_amount: firstDeposit,
        second_amount: secondDeposit
      })
      .then(
        () => {
          this.stripeMicrodepositModal.setLoading(false);
          this.stripeMicrodepositModal.close();
          this.props.store.fetchPayment();
        },
        () => {
          this.stripeMicrodepositModal.setLoading(false);
        }
      );
  }

  removeFn() {
    this.confirmDeleteModal.setLoading(true);
    client
      .post(`${URL_CONFIG.destroy_card_path}`, {
        email: this.props.email,
        stripeToken: this.props.card.id
      })
      .then(
        () => {
          this.confirmDeleteModal.setLoading(false);
          this.confirmDeleteModal.close();
          this.props.store.removePaymentCardSource(this.props.card.id);
        },
        () => {
          this.confirmDeleteModal.setLoading(false);
        }
      );
  }

  render() {
    const styles = reactCSS({
      default: {
        cardLabel: {
          fontSize: "100%"
        }
      }
    });

    return (
      <div className="user-billing-address-group">
        <FormGroup controlId="staticControl">
          <Col sm={12} className="text-right">
            {(() => {
              //Check if need to show 'Verify' button for bank account type
              if (this.props.card.object == "bank_account" && this.props.card.status == "new") {
                return (
                  <Button outlined bsStyle="info" style={{ marginRight: 7 }} onClick={::this.onClickVerify}>
                    Verify
                  </Button>
                );
              }
            })()}
            <Button outlined bsStyle="danger" onClick={::this.onClickRemove}>
              Remove
            </Button>{" "}
          </Col>
        </FormGroup>
        {(() => {
          if (this.props.card.object != "bank_account") {
            return (
              <UserPaymentCard
                card={this.props.card}
                address={this.state.address}
                linkAddress={::this.linkAddress}
                addresses={this.props.addresses}
                email={this.props.email}
              />
            );
          } else {
            return (
              <UserPaymentBankAccount
                card={this.props.card}
                address={this.state.address}
                linkAddress={::this.linkAddress}
                addresses={this.props.addresses}
                email={this.props.email}
              />
            );
          }
        })()}
        <ModalConfirm
          message="Do you want to remove this Card?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
        <CardLinkAddressModal
          ref={c => (this.linkAddressModal = c)}
          addresses={this.props.addresses}
          address_id={this.state.address.id}
          resolvedFn={::this.linkAddressResolved}
        />
        <StripeMicrodepositModal
          ref={c => (this.stripeMicrodepositModal = c)}
          resolvedFn={::this.stripeMicrodepositResolved}
        />
      </div>
    );
  }
}
