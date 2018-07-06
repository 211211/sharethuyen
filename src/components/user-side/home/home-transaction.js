import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import { URL_CONFIG } from "../../../common/config";
import util from "../../../common/util";

import isNumber from "lodash/isNumber";

import { Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

export default class HomeTransaction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DatatableComponent ajaxUrl={URL_CONFIG.user_dashboard_transaction_path} />
      </div>
    );
  }
}

@withRouter
class DatatableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goToView = this.goToView.bind(this);
  }

  componentDidMount() {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));

    //Work around by expose global fn
    //to make react work with datatable
    window.goToViewFn = this.goToView;
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    this.table = util.initDataTable(datatableEl, this.props.ajaxUrl, [
      {
        targets: -3,
        render: function(data) {
          return isNumber(data) ? util.currencyFormatter().format(data) : "";
        }
      },
      {
        targets: -2,
        render: function(data) {
          return isNumber(data) ? util.currencyFormatter().format(data) : "";
        }
      },
      {
        targets: -1,
        render: function(data) {
          return isNumber(data) ? util.currencyFormatter().format(data) : "";
        }
      },
      {
        targets: 2,
        render: function(data, type, row, meta) {
          var id = data;
          return '<a href="#"' + 'onclick="return goToViewFn(' + id + ')">' + id + "</a>";
        }
      }
    ]);
  }

  goToView(booking_id) {
    this.props.router.push(`${URL_CONFIG.user_bookings_path}/${booking_id}`);
    return false;
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction Time</th>
            <th>Booking #</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Transaction Time</th>
            <th>Booking #</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </tfoot>
      </Table>
    );
  }
}
