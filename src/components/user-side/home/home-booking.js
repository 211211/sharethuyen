import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";

import ModalConfirm from "../../_core/modal-confirm";

import { URL_CONFIG, CONSTANT } from "../../../common/config";
import util from "../../../common/util";
import client from "../../../common/http-client";
import BookingCancelModal from "../../_core/booking/booking-cancel-modal";

import { Button, Row, Col, Grid, Panel, Table, PanelBody, PanelContainer } from "@sketchpixy/rubix";

export default class HomeBooking extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DatatableComponent
          booking_type={this.props.booking_type}
          ajaxUrl={URL_CONFIG.user_dashboard_booking_path + "?booking_type=" + this.props.booking_type}
        />
      </div>
    );
  }
}

@withRouter
class DatatableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.goToView = this.goToView.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.state = {
      booking_id: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.ajaxUrl != nextProps.ajaxUrl) {
      //Should reload datatable
      this.initDataTable(nextProps);
    }
  }

  componentDidMount() {
    this.initDataTable(this.props);
  }

  initDataTable(props) {
    let datatableEl = $(ReactDOM.findDOMNode(this.datatable));
    let { booking_type } = props;

    //Work around by expose global fn
    //to make react work with datatable
    window.goToViewFn = this.goToView;
    window.openConfirmModalFn = this.openConfirmModal;
    if ($.fn.dataTable.isDataTable(datatableEl)) {
      datatableEl.DataTable().destroy();
    }
    this.table = util.initDataTable(datatableEl, props.ajaxUrl, [
      {
        targets: 1,
        render: function(data, type, row, meta) {
          return '<span class="label label-success">' + data + "</span>";
        }
      },
      {
        targets: -3,
        render: function(data) {
          return util.currencyFormatter().format(data);
        }
      },
      {
        targets: -1,
        data: null,
        render: function(data, type, row, meta) {
          let id = data[0];
          let status = data[1];

          let removeTpl =
            '<button style="margin-right:12.5px;" type="button"' +
            'class="remove-sm btn-red btn btn-default" ' +
            'onclick="openConfirmModalFn(' +
            id +
            ')">Cancel</button>';
          let viewTpl =
            '<button type="button"' +
            'class="btn-green btn-onlyOnHover btn-outlined btn btn-default" ' +
            'onclick="goToViewFn(' +
            id +
            ')">View</button>';

          if (
            booking_type != "booking_history" &&
            (status == CONSTANT.BOOKING_STATUS.tba || status == CONSTANT.BOOKING_STATUS.confirmed)
          ) {
            return removeTpl + viewTpl;
          } else {
            return viewTpl;
          }
        }
      }
    ]);
  }

  resolvedCancelBookingFn() {
    this.initDataTable(this.props);
  }

  openConfirmModal(bookingId) {
    let newState = this.state;
    newState.booking_id = bookingId;
    this.setState(newState);
    this.confirmCancelModalWrapper.open();
  }

  goToView(booking_id) {
    this.props.router.push(`${URL_CONFIG.user_bookings_path}/${booking_id}`);
  }

  render() {
    return (
      <Table ref={c => (this.datatable = c)} className="display" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th data-orderable="false" data-searchable="false">
              Days
            </th>
            <th data-orderable="false" data-searchable="false">
              $
            </th>
            <th>Class</th>
            <th data-orderable="false" data-searchable="false">
              Action
            </th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days</th>
            <th>$</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </tfoot>
        <BookingCancelModalWrapper
          ref={c => (this.confirmCancelModalWrapper = c)}
          booking_id={this.state.booking_id}
          resolvedFn={::this.resolvedCancelBookingFn}
        />
      </Table>
    );
  }
}

class BookingCancelModalWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: {
        id: props.booking_id
      }
    };
  }

  open() {
    let { booking_id } = this.props;
    this.setState({
      booking: {
        id: booking_id
      }
    });
    this.confirmCancelModal.wrappedInstance.open();
  }

  resolvedCancelBookingFn() {
    this.props.resolvedFn();
  }

  render() {
    return (
      <BookingCancelModal
        user_side
        ref={c => (this.confirmCancelModal = c)}
        booking={this.state.booking}
        resolvedFn={::this.resolvedCancelBookingFn}
      />
    );
  }
}
