import React from "react";

import { Button, Modal } from "@sketchpixy/rubix";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import client from "../../../common/http-client";
import FillUpModal from "./fill-up-modal";
import ModalConfirm from "../modal-confirm";
import ChangeMeterModal from "./change-meter-modal";
import EditFuelModal from "./edit-fuel-modal";

export default class FuelActions extends React.Component {
  render() {
    const { boat, fuelUpdateSuccess, changeMeterSuccess, bookingId } = this.props;
    const { fuel_meter_enabled } = boat;
    return (
      <div>
        <Button onClick={::this.openFillUpModal} className="btn-outlined btn btn-primary">
          Fill Up
        </Button>
        <Button style={{ marginLeft: 5 }} onClick={::this.openEditModal} className="btn-outlined btn btn-primary">
          Edit Fuel
        </Button>
        {fuel_meter_enabled && (
          <Button style={{ marginLeft: 5 }} onClick={::this.openChangeModal} className="btn-outlined btn btn-primary">
            Change Meter
          </Button>
        )}
        <FillUpModal
          fuel_remain={boat.fuel_remain}
          boatId={boat.id}
          fuelUpdateSuccess={fuelUpdateSuccess}
          bookingId={bookingId}
          ref={c => (this.fillUpModal = c)}
        />
        <EditFuelModal
          fuel_remain={boat.fuel_remain}
          boatId={boat.id}
          fuelUpdateSuccess={fuelUpdateSuccess}
          bookingId={bookingId}
          ref={c => (this.editFuelModal = c)}
        />
        <ChangeMeterModal
          boatId={boat.id}
          changeMeterSuccess={changeMeterSuccess}
          ref={c => (this.changeMeterModal = c)}
        />
      </div>
    );
  }

  openFillUpModal() {
    this.fillUpModal.open();
  }

  openEditModal() {
    this.editFuelModal.open();
  }

  openChangeModal() {
    this.changeMeterModal.open();
  }
}
