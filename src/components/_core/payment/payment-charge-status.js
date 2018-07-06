import React from "react";
import Select from "react-select";

import { Icon } from "@sketchpixy/rubix";

import { CONSTANT } from "../../../common/config";

export default class PaymentChargeStatus extends React.Component {
  render() {
    switch (this.props.status) {
      case CONSTANT.CHARGE_STATUS.created:
        return (
          <Icon className="fg-paleorange" style={{ fontSize: 20 }} title="Need charge now" glyph="icon-fontello-info" />
        );
        break;
      case CONSTANT.CHARGE_STATUS.succeeded:
        return <Icon className="fg-green" style={{ fontSize: 20 }} glyph="icon-fontello-ok" />;
        break;
      case CONSTANT.CHARGE_STATUS.pending:
        return (
          <Icon
            className="fg-yellow"
            style={{ fontSize: 20 }}
            title="Take some days to know status"
            glyph="icon-fontello-arrows-cw"
          />
        );
        break;
      case CONSTANT.CHARGE_STATUS.failed:
        return <Icon className="fg-red" style={{ fontSize: 20 }} glyph="icon-fontello-cancel-1" />;
        break;
      case CONSTANT.CHARGE_STATUS.refunded:
        return <Icon className="fg-green" style={{ fontSize: 20 }} glyph="icon-fontello-ok" />;
        break;
      default:
        return null;
    }
  }
}
