import React from "react";
import reactCSS from "reactcss";

import { Button } from "@sketchpixy/rubix";

import PaymentMethodChangeModal from "../payment/payment-method-change-modal";
import client from "../../../common/http-client";
import { URL_CONFIG, CONSTANT } from "../../../common/config";
import util from "../../../common/util";

export default class PaymentMethod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddCardModal: false,
      charge: props.charge
    };
  }

  componentWillReceiveProps(nextProps) {
    var newState = this.state;
    newState.charge = nextProps.charge;
    this.setState(newState);
  }

  openChangeCardModal() {
    this.changeCardModal.open();
  }

  openAddCardModal() {
    var newState = this.state;
    newState.showAddCardModal = true;
    this.setState(newState);
  }

  closeAddCardModal() {
    var newState = this.state;
    newState.showAddCardModal = false;
    this.setState(newState);
  }

  cardChangeModalResolved(source, card_id) {
    let { charge } = this.props;
    let update_payment_method_url = `${URL_CONFIG.charges_path}/${charge.id}/update_payment_method`;
    if (this.props.user_side) {
      update_payment_method_url = `${URL_CONFIG.user_charges_path}/${charge.id}/update_payment_method`;
    }
    this.changeCardModal.setSubmitDisable(true);
    this.changeCardModal.setLoaded(false);
    client
      .put(update_payment_method_url, {
        source: source,
        stripe_source_id: card_id
      })
      .then(
        response => {
          var newState = this.state;
          newState.showModal = false;
          newState.charge.stripe_source_id = card_id;
          newState.charge.source = source;
          this.setState(newState);
          this.changeCardModal.close();
          this.changeCardModal.setSubmitDisable(false);
          this.changeCardModal.setLoaded(true);

          if (response.type == "created_new_charge") {
            util.growl("new_charge_created_successfully");
            this.props.refreshCharges();
          }
          if (response.type == "remove_ref_charge") {
            util.growl("remove_ref_charge_successfully");
            this.props.refreshCharges();
          }
        },
        response => {
          if (response.status == 400) {
            if (response.responseJSON.hasOwnProperty("errors")) {
              $(document).trigger("ei:showAlert", [response.responseJSON]);
            }
          }
          this.changeCardModal.setSubmitDisable(false);
          this.changeCardModal.setLoaded(true);
        }
      );
  }

  canUpdatePaymentDetail(charge) {
    return charge.status == CONSTANT.CHARGE_STATUS.created || charge.status == CONSTANT.CHARGE_STATUS.failed;
  }

  render() {
    const styles = reactCSS({
      default: {
        cardButtonWrapper: {
          display: "inline-block",
          width: "93px"
        }
      }
    });

    let card = {};
    let charge = this.state.charge;
    if (charge.source == "stripe") {
      card =
        this.props.cards.find(card => {
          return card.id == charge.stripe_source_id;
        }) || {};
    }

    let payment_name = charge.source;

    if (charge.source == "stripe" && typeof card.last4 != "undefined") {
      payment_name = "···· " + card.last4;
    }

    let canUpdatePayment = this.canUpdatePaymentDetail(charge);

    return (
      <div>
        <span>{payment_name}</span>
        <div className="visible-xs-inline-block" />
        {(() => {
          if (canUpdatePayment) {
            return (
              <span style={styles.cardButtonWrapper}>
                <Button outlined bsStyle="info" onClick={::this.openChangeCardModal}>
                  Change
                </Button>
              </span>
            );
          }
        })()}
        <PaymentMethodChangeModal
          user_side={this.props.user_side}
          ref={c => (this.changeCardModal = c)}
          charge={charge}
          cards={this.props.cards}
          user={this.props.user}
          resolvedFn={::this.cardChangeModalResolved}
          user_charge={this.props.user_charge}
        />
      </div>
    );
  }
}
