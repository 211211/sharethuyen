import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import { URL_CONFIG } from "../common/config";

import { Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

import util from "../common/util";
import ExportTransactions from "../components/transactions/export-transactions";

import isNumber from "lodash/isNumber";
import Util from "../common/util";

export default class Transactions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <PanelContainer>
          <Panel>
            <PanelBody>
              <Grid>
                <Row className="page-header">
                  <Col md={6}>
                    <h3>Transactions</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <DatatableComponent ajaxUrl={URL_CONFIG.transactions_path} />
                  </Col>
                </Row>
              </Grid>
            </PanelBody>
          </Panel>
        </PanelContainer>
        <ExportTransactions />
      </div>
    );
  }
}

@withRouter
class DatatableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goToView = this.goToView.bind(this);
    this.goToUserProfile = this.goToUserProfile.bind(this);
  }

  componentDidMount(prevProps) {
    var datatableEl = $(ReactDOM.findDOMNode(this.datatable));
    datatableEl.on("search.dt", () => Util.setQueryUrl($(".dataTables_filter input").val()));
    //Work around by expose global fn
    //to make react work with datatable
    window.goToViewFn = this.goToView;
    window.goToUserProfileFn = this.goToUserProfile;
    this.table = datatableEl.addClass("nowrap").DataTable({
      processing: true,
      rowId: "id",
      order: [0, "desc"],
      responsive: true,
      serverSide: true,
      ajax: {
        url: this.props.ajaxUrl
      },
      columnDefs: [
        {
          targets: -2,
          render: function(data) {
            return isNumber(data) ? util.currencyFormatter().format(data) : "";
          }
        },
        {
          targets: -3,
          render: function(data) {
            return isNumber(data) ? util.currencyFormatter().format(data) : "";
          }
        },
        {
          targets: 2,
          data: null,
          render: function(data, type, row, meta) {
            var userId = data[data.length - 1];
            if (userId) {
              return `<a href="" onclick="goToUserProfileFn('${userId}');return false;">${data[2]}</a>`;
            } else {
              return "";
            }
          }
        },
        {
          targets: 3,
          render: function(data, type, row, meta) {
            var id = data;
            return '<a href="#"' + 'onclick="return goToViewFn(' + id + ')">' + id + "</a>";
          }
        }
      ],
      search: { search: Util.retrieveSearchQuery() }
    });
  }

  goToView(booking_id) {
    this.props.router.push(`${URL_CONFIG.bookings_path}/${booking_id}`);
    return false;
  }

  goToUserProfile(user_id) {
    this.props.router.push(`${URL_CONFIG.users_path}/${user_id}/edit`);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Transaction Time</th>
            <th>User</th>
            <th>Booking #</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th data-orderable="false" data-searchable="false" data-visible="false" />
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>ID</th>
            <th>Transaction Time</th>
            <th>User</th>
            <th>Booking #</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th />
          </tr>
        </tfoot>
      </Table>
    );
  }
}
