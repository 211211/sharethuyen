import React from "react";
import Select from "react-select";
import { Form, FormGroup, Col, Row, Button, FormControl, ControlLabel, Image, Table, Icon } from "@sketchpixy/rubix";
import { isNil } from "lodash/lang";
import { inject, observer } from "mobx-react";
import { computed, reaction } from "mobx";
import moment from "moment";

import client from "../../../../common/http-client";
import util from "../../../../common/util";
import { URL_CONFIG, CONSTANT } from "../../../../common/config";
import AddonSelectModal from "./addon-select-modal";
import ModalConfirm from "../../modal-confirm";

@inject("store", "newBookingStore")
@observer
export default class AddonDetail extends React.Component {
  @computed
  get booking() {
    return this.props.newBookingStore;
  }
  openAddonSelectModal() {
    this.addonSelectModal.open();
  }

  addonSelectResolved(submitAddons) {
    const { user_side } = this.props;

    if (this.booking.mode == "new") {
      this.updateBookingAddons(submitAddons);
      this.addonSelectModal.close();
      return;
    }
    let url = URL_CONFIG.admin_assign_booking_addons;
    if (user_side) {
      url = URL_CONFIG.user_assign_booking_addons;
    }
    const submit_data = {
      booking_id: this.booking.id,
      booking_addons: submitAddons
    };

    client.post(url, submit_data).then(
      res => {
        if (res.type != "error") {
          this.props.onUpdateAddons(res);
          util.growl("addon_added_successfully");
        }
      },
      response => {
        if (response.status == 400) {
          if (response.responseJSON.hasOwnProperty("errors")) {
            $(document).trigger("ei:showAlert", [response.responseJSON]);
          }
          if (response.responseJSON.hasOwnProperty("error")) {
            util.growlError(response.responseJSON.error);
          }
        }
      }
    );
    this.addonSelectModal.close();
  }

  @computed
  get settings() {
    return this.props.store.settings;
  }

  onClickRemove(booking_addon) {
    this.selected_booking_addon = booking_addon;
    this.confirmDeleteModal.open();
  }

  removeFn() {
    if (this.booking.mode == "new") {
      const index = this.booking.booking_addons.indexOf(this.selected_booking_addon);
      this.booking.booking_addons.splice(index, 1);
      this.confirmDeleteModal.close();
      return;
    }
    this.confirmDeleteModal.setLoading(true);
    let booking_addon_id = this.selected_booking_addon.id;
    const { user_side } = this.props;
    let url = URL_CONFIG.admin_booking_addons_path;
    if (user_side) {
      url = URL_CONFIG.user_booking_addons_path;
    }
    client.delete(`${url}/${booking_addon_id}`).then(
      res => {
        const booking_addons = this.booking.booking_addons.filter(
          booking_addon => booking_addon.id !== booking_addon_id
        );
        this.props.onUpdateAddons(booking_addons);
        util.growl("addon_remove_successfully");
        this.confirmDeleteModal.setLoading(false);
        this.confirmDeleteModal.close();
      },
      () => {
        this.confirmDeleteModal.setLoading(false);
      }
    );
  }

  render() {
    const hasAddons = this.hasAddons();
    const { booking } = this;
    const { booking_addons, start_date, end_date } = booking;
    const dateSelected = moment.isMoment(start_date) && moment.isMoment(end_date);
    if (!dateSelected) {
      return (
        <Form horizontal>
          <Col sm={3} />
          <Col sm={9}>
            <em>Please select booking's dates.</em>
          </Col>
        </Form>
      );
    }
    return (
      <Form horizontal>
        <Col sm={3} />
        {!hasAddons && (
          <Col sm={9}>
            <em>
              Please select below to add any extra items such as life jackets or skiing equipment to your booking.
            </em>
          </Col>
        )}
        {hasAddons && (
          <Col sm={9}>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Created At</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {booking_addons.map((booking_addon, index) => {
                  if (booking_addon.status === CONSTANT.BOOKING_ADDON_STATUS.cancelled) return;
                  return (
                    <tr key={index}>
                      <td>{booking_addon.id ? booking_addon.id : ""}</td>
                      <td>{booking_addon.addon.name}</td>
                      <td className="text-right">{booking_addon.quantity}</td>
                      <td>{booking_addon.created_at ? booking_addon.created_at : ""}</td>
                      <td>
                        {booking_addon.status != CONSTANT.BOOKING_ADDON_STATUS.paid && (
                          <div className="actions">
                            <Button
                              onClick={() => {
                                this.onClickRemove(booking_addon);
                              }}
                              outlined
                              bsStyle="danger"
                              className="fav-btn"
                            >
                              <Icon glyph="icon-simple-line-icons-close" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        )}

        <Col sm={6} />
        {booking.status != CONSTANT.BOOKING_STATUS.completed &&
          booking.status != CONSTANT.BOOKING_STATUS.cancelled && (
            <Col sm={4} smOffset={3}>
              <Button outlined bsStyle="info" style={{ marginTop: 10 }} onClick={::this.openAddonSelectModal}>
                Add add-on
              </Button>
            </Col>
          )}

        <AddonSelectModal
          booking={booking}
          ref={c => (this.addonSelectModal = c)}
          resolvedFn={::this.addonSelectResolved}
        />
        <ModalConfirm
          message="Do you want to remove this add-on?"
          ref={c => (this.confirmDeleteModal = c)}
          resolvedFn={::this.removeFn}
        />
      </Form>
    );
  }

  hasAddons() {
    const { booking_addons } = this.booking;
    if (isNil(booking_addons) || booking_addons.length == 0) return false;
    const numOfNotCancelledAddons = booking_addons.filter(booking_addon => {
      return booking_addon.status !== CONSTANT.BOOKING_ADDON_STATUS.cancelled;
    }).length;
    return numOfNotCancelledAddons > 0;
  }

  updateBookingAddons(submitAddons) {
    submitAddons.forEach(submitAddon => {
      this.booking.booking_addons.push({
        addon: {
          id: submitAddon.id,
          name: submitAddon.name
        },
        quantity: submitAddon.quantity,
        status: CONSTANT.BOOKING_ADDON_STATUS.unpaid,
        price_strategy: submitAddon.price_strategy,
        price: submitAddon.price
      });
    });
  }
}
