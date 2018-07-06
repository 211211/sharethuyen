import React from "react";

import { Col, PanelContainer, Panel, PanelBody, Grid, Row } from "@sketchpixy/rubix";

import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { URL_CONFIG, CONSTANT } from "../common/config";
import client from "../common/http-client";
import util from "../common/util";
import MembershipTypeUtil from "../common/membership-type-util";

import { isNaN } from "lodash/lang";
import { map } from "lodash/collection";

import { inject, observer } from "mobx-react";

@inject("store")
@observer
export default class PricingSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prices: {}
    };

    this.onCellEdit = this.onCellEdit.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
  }

  componentDidMount() {
    client.get(URL_CONFIG.boat_class_prices_json).then(res => {
      this.setState({
        prices: res
      });
    });
  }

  onCellEdit(row, fieldName, value) {
    let price = parseFloat(value);

    let boatClassPriceId = row[fieldName + "_id"];

    client.put(`${URL_CONFIG.boat_class_prices}/${boatClassPriceId}`, {
      price: price
    });

    return price;
  }

  onBeforeSaveCell(row, fieldName, value) {
    if (isNaN(parseFloat(value))) {
      util.growlError("Price must be a number");
      return false;
    }

    return true;
  }

  render() {
    let disabledUserTypes = this.props.store.settings.disabled_user_types || [];

    let membershipTypes = [
      CONSTANT.MEMBERSHIP_TYPE.full,
      CONSTANT.MEMBERSHIP_TYPE.mid_week,
      CONSTANT.MEMBERSHIP_TYPE.unlimited,
      CONSTANT.MEMBERSHIP_TYPE.shared,
      CONSTANT.MEMBERSHIP_TYPE.daily
    ];

    let availableMembershipTypes = MembershipTypeUtil.removeDisabledMembershipType(membershipTypes, disabledUserTypes);

    const cellEditProp = {
      mode: "click",
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell
    };

    let headers = availableMembershipTypes.map(function(user_type) {
      return (
        <TableHeaderColumn
          key={user_type}
          dataField={user_type}
          dataFormat={cell => cell || 0}
          headerAlign="center"
          dataAlign="center"
          width="100"
        >
          {user_type}
        </TableHeaderColumn>
      );
    });

    let _this = this;

    let priceTables = map(this.state.prices, function(value, key) {
      return (
        <PanelContainer key={key}>
          <Panel>
            <PanelBody>
              <Grid>
                <Row className="page-header">
                  <Col md={6}>
                    <h3>{key} Prices</h3>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <BootstrapTable
                      data={value}
                      hover
                      cellEdit={cellEditProp}
                      options={{ onCellEdit: _this.onCellEdit }}
                    >
                      <TableHeaderColumn isKey dataField="boat_class_id" hidden>
                        ID
                      </TableHeaderColumn>
                      <TableHeaderColumn dataField="boat_class_name" editable={false}>
                        Boat Class
                      </TableHeaderColumn>
                      {headers}
                    </BootstrapTable>,
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
      );
    });

    return <div>{priceTables}</div>;
  }
}
