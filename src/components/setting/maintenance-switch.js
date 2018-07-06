import React from "react";
import Toggle from "react-toggle";

import { Col, FormGroup, FormControl } from "@sketchpixy/rubix";

import ModalConfirm from "../../components/_core/modal-confirm";
import util from "../../common/util";
import client from "../../common/http-client";
import { URL_CONFIG } from "../../common/config";

export default class MaintenanceSwitch extends React.Component {
  constructor() {
    super();
    this.state = {
      down_for_maintenance: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const { down_for_maintenance } = nextProps;
    if (down_for_maintenance !== this.state.down_for_maintenance) {
      this.setState({ down_for_maintenance });
    }
  }
  render() {
    const { down_for_maintenance } = this.state;
    const { handleChangeSwitch, performStatusChange } = this;
    return (
      <div>
        <Col md={12}>
          <h4 className="section-form-title">Down for maintenance</h4>
        </Col>
        <FormGroup>
          <Col sm={3} />
          <Col sm={9}>
            <Toggle
              name="down_for_maintenance"
              checked={down_for_maintenance}
              onChange={handleChangeSwitch.bind(this)}
            />
          </Col>
        </FormGroup>
        <ModalConfirm
          message="Do you want to perform this action?"
          ref={c => (this.confirmSwitchModal = c)}
          resolvedFn={performStatusChange.bind(this)}
        />
      </div>
    );
  }

  handleChangeSwitch(e) {
    // down_for_maintenance stay the old value, waiting for confirmation
    const down_for_maintenance = this.state.down_for_maintenance;
    this.setState({ down_for_maintenance });
    this.confirmSwitchModal.open();
  }
  performStatusChange() {
    const newStatus = !this.state.down_for_maintenance;
    this.confirmSwitchModal.setLoading(true);
    client
      .put(`${URL_CONFIG.update_value_by_var_path}`, {
        var: "down_for_maintenance",
        value: newStatus
      })
      .then(
        () => {
          this.confirmSwitchModal.setLoading(false);
          this.confirmSwitchModal.close();
          this.props.handleChangeSetting("down_for_maintenance", newStatus);
          util.growl("Status updated successfully!");
        },
        () => {
          this.confirmSwitchModal.setLoading(false);
        }
      );
  }
}
